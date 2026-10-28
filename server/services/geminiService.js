const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '' && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (err) {
    console.warn('[Gemini Init Warning]:', err.message);
  }
}

/**
 * Builds the sleep guidance system instructions and contextual user telemetry.
 */
function buildSleepPromptContext({ user, sleepLogs = [], message, conversationHistory = [] }) {
  const profile = user?.sleepProfile || {
    targetHours: 8,
    chronotype: 'Intermediate',
    bedtimePreference: '23:00',
    wakePreference: '07:00',
    caffeineCutoffHour: 14,
    stressLevel: 'Moderate',
    primaryGoal: 'Improve overall sleep quality and energy',
  };

  // Summarize recent sleep metrics
  let logSummary = 'No sleep logs recorded yet.';
  if (sleepLogs && sleepLogs.length > 0) {
    const recent = sleepLogs.slice(0, 7);
    const avgScore = Math.round(recent.reduce((acc, l) => acc + (l.sleepScore || 70), 0) / recent.length);
    const avgDuration = (recent.reduce((acc, l) => acc + l.durationMinutes, 0) / (recent.length * 60)).toFixed(1);
    const avgLatency = Math.round(recent.reduce((acc, l) => acc + (l.sleepLatencyMinutes || 15), 0) / recent.length);
    const avgAwakenings = (recent.reduce((acc, l) => acc + (l.awakeningsCount || 0), 0) / recent.length).toFixed(1);

    logSummary = `User's Last ${recent.length} Sleep Logs Summary:
- Average Sleep Score: ${avgScore}/100
- Average Duration: ${avgDuration} hours (Target: ${profile.targetHours} hours)
- Average Sleep Latency: ${avgLatency} minutes
- Average Night Awakenings: ${avgAwakenings} times
- Recent logs snapshot:
${recent.map((l, i) => `  Day ${i + 1} (${new Date(l.date).toLocaleDateString()}): Bedtime ${l.bedtime}, Wake ${l.wakeTime}, Duration ${(l.durationMinutes/60).toFixed(1)}h, Latency ${l.sleepLatencyMinutes}m, Score ${l.sleepScore || 'N/A'}, Mood ${l.morningMood}, Caffeine ${l.caffeineCups || 0} cups`).join('\n')}`;
  }

  const systemInstructions = `You are SomnaAI, an evidence-based clinical sleep science assistant and circadian rhythm specialist.
You help users optimize their sleep architecture (Deep SWS, REM, Light sleep), circadian alignment, and daytime energy using principles of CBT-I (Cognitive Behavioral Therapy for Insomnia), sleep hygiene, and environmental controls.

User Profile:
- Name: ${user?.name || 'Sleep Seeker'}
- Chronotype: ${profile.chronotype}
- Target Sleep: ${profile.targetHours} hours
- Preferred Bedtime: ${profile.bedtimePreference} | Target Wake: ${profile.wakePreference}
- Caffeine Cutoff: ${profile.caffeineCutoffHour}:00 (${profile.caffeineCutoffHour > 12 ? profile.caffeineCutoffHour - 12 + ' PM' : profile.caffeineCutoffHour + ' AM'})
- Self-Reported Stress: ${profile.stressLevel}
- Primary Sleep Goal: ${profile.primaryGoal}

${logSummary}

Guidelines for your response:
1. Ground your advice in clinical sleep science (e.g. adenosine buildup, melatonin onset, core body temperature drop, sleep cycle duration ~90 minutes).
2. Reference their actual data and habits when relevant (e.g. comparing their duration with their target hours, latency, or caffeine cutoff).
3. Be empathetic, encouraging, and actionable. Structure your answer using clean Markdown with bolding, concise bullet points, and numbered action steps.
4. If they report severe symptoms like sleep apnea, chronic untreated insomnia (>3 months), or narcolepsy, advise consulting a board-certified sleep physician.
5. End with 2-3 concise, bulleted "Actionable Tonight" tips.`;

  return { systemInstructions, userPrompt: message };
}

/**
 * Fallback AI response generator if Gemini API key is missing or quota is exceeded.
 * Delivers context-rich sleep science responses based on user query analysis.
 */
function generateContextualFallback({ user, sleepLogs = [], message }) {
  const lower = message.toLowerCase();
  const name = user?.name ? user.name.split(' ')[0] : 'there';
  const target = user?.sleepProfile?.targetHours || 8;
  const chronotype = user?.sleepProfile?.chronotype || 'Intermediate';

  let responseText = '';
  let tips = [];

  if (lower.includes('wake') && (lower.includes('3 am') || lower.includes('night') || lower.includes('middle'))) {
    responseText = `Hello ${name}! Waking up in the middle of the night (typically between 2:00 AM and 4:00 AM) is one of the most common sleep disturbances.

### Why This Happens:
1. **Sleep Architecture Shift**: After roughly 4 hours of sleep, your body transitions out of deep slow-wave sleep into longer REM and light Stage 2 cycles, making awakenings much easier.
2. **Cortisol & Blood Sugar Dip**: Nocturnal blood sugar fluctuations or high daytime stress can trigger a mild surge of norepinephrine or cortisol.
3. **Core Body Temperature**: If your bedroom is above 18-19°C (65-68°F), your body struggles to shed heat during REM, triggering awakenings.

### Clinical Protocol:
- **The 20-Minute Rule**: If you cannot fall back asleep within 20 minutes, get out of bed. Remaining in bed tossing and turning builds a conditioned anxiety association with your mattress.
- **Dim Light Reset**: Sit in a comfortable chair with dim, warm lighting and read a physical book until drowsiness returns.`;

    tips = [
      'Maintain bedroom temperature between 18°C - 20°C (65°F - 68°F)',
      'Avoid checking your phone clock when you wake up (clock-watching elevates alertness)',
      'Perform physiological sigh breathing (two quick inhales through nose, long exhale through mouth)'
    ];
  } else if (lower.includes('fall asleep') || lower.includes('insomnia') || lower.includes('latency') || lower.includes('fast')) {
    responseText = `Hi ${name}! Long sleep latency (taking more than 20-30 minutes to drift off) usually stems from an overactive sympathetic nervous system or insufficient adenosine sleep pressure.

### Key Factors for your ${chronotype} Chronotype:
1. **Light Hygiene & Melatonin Suppression**: Blue and bright white light from phones and laptops delays your natural melatonin release curve by up to 90 minutes.
2. **Adenosine Sleep Debt**: To feel sleep pressure, your brain needs at least 14-16 hours of continuous wakefulness and mild physical activity.
3. **Cognitive Hyperarousal**: Work-related thoughts or evening worry triggers mild fight-or-flight signaling.

### Recommended Wind-Down Routine:
- **60 Minutes Before Bed**: Power down high-stimulation screens.
- **Warm Shower or Bath**: 90 minutes before bed, take a warm shower. When you step out, blood rushes to the extremities, lowering your core temperature—a required physiological signal for sleep.`;

    tips = [
      'Use the 4-7-8 breathing method: inhale 4s, hold 7s, exhale 8s',
      'Set an electronic curfew 45 minutes before your target bedtime',
      'Keep a "brain dump" notebook on your nightstand to write down tomorrow\'s to-dos'
    ];
  } else if (lower.includes('caffeine') || lower.includes('coffee') || lower.includes('tea')) {
    const cutoff = user?.sleepProfile?.caffeineCutoffHour || 14;
    responseText = `Hello ${name}! Caffeine is one of the most potent sleep disruptors due to its molecular pharmacology.

### The Sleep Science of Caffeine:
1. **Adenosine Antagonism**: Caffeine blocks adenosine receptors in the brain. Adenosine is the molecule that builds up every hour you are awake to create "sleep pressure".
2. **Half-Life & Quarter-Life**: Caffeine has an average half-life of **5 to 7 hours** and a quarter-life of **10 to 12 hours**. If you have a 200mg coffee at 3:00 PM, ~50mg is still active in your brain at 1:00 AM!
3. **Deep Sleep Reduction**: Even if you are able to fall asleep with caffeine in your system, clinical studies show it can reduce deep slow-wave restorative sleep by 20% to 30%.`;

    tips = [
      `Enforce a strict caffeine curfew at ${cutoff > 12 ? (cutoff - 12) + ':00 PM' : cutoff + ':00 AM'}`,
      'Switch to herbal teas like Chamomile, Lemon Balm, or Peppermint after lunch',
      'Stay hydrated with electrolyte-balanced water upon waking'
    ];
  } else if (lower.includes('debt') || lower.includes('tired') || lower.includes('catch up') || lower.includes('weekend')) {
    responseText = `Hi ${name}! Sleep debt occurs when you sleep fewer hours than your biological baseline (your target is ${target} hours).

### Can You "Catch Up" on Sleep?
- **The Good News**: Extending sleep by 1-1.5 hours on the weekend or taking a 20-30 minute afternoon nap can partially restore alertness and lower cardiovascular strain.
- **The Warning**: Sleeping in 3-4 hours later on Sundays creates **Social Jetlag**. It shifts your circadian master clock, making it nearly impossible to fall asleep Sunday night, causing the classic "Monday morning zombie" feeling.

### Safe Debt Recovery Plan:
1. Instead of sleeping in late, go to bed 30-45 minutes earlier.
2. If taking a daytime nap, cap it at **25 minutes** and complete it before 2:30 PM so it doesn't deplete tonight's sleep pressure.`;

    tips = [
      'Cap weekend sleep-ins to no more than 60 minutes beyond normal wake time',
      'Get 10-15 minutes of direct outdoor sunlight within 30 minutes of waking',
      'Go to bed 30 minutes earlier rather than waking up hours later'
    ];
  } else {
    responseText = `Hello ${name}! As your SomnaAI sleep guide, I am here to help you dial in your sleep schedule, improve sleep efficiency, and optimize recovery.

### Sleep Optimization Priorities for you:
1. **Circadian Anchoring**: Your body's circadian rhythm thrives on regularity. Waking up at the same time every day (±30 mins) sets your adenosine and melatonin timers.
2. **Morning Photobiology**: Viewing sunlight within 30-60 minutes of waking triggers a cortisol awakening response that elevates morning alertness and programs melatonin onset ~14 hours later.
3. **Target Sleep Window**: Based on your ${target}-hour goal and ${user?.sleepProfile?.bedtimePreference || '23:00'} preferred bedtime, focus on giving yourself an 8.5-hour sleep opportunity window in a cool, pitch-dark room.`;

    tips = [
      'Aim for 10-15 minutes of morning sunlight without sunglasses',
      'Keep your sleep and wake schedule consistent across both weekdays and weekends',
      'Ensure your bedroom is cool (around 18-19°C) and completely dark'
    ];
  }

  return {
    text: responseText,
    actionableTips: tips,
    source: 'SomnaAI Sleep Science Engine (Local Mode)',
  };
}

/**
 * Main service method to send a prompt to Gemini or fallback smoothly.
 */
async function generateSleepAdvice({ user, sleepLogs = [], message, conversationHistory = [] }) {
  const { systemInstructions, userPrompt } = buildSleepPromptContext({
    user,
    sleepLogs,
    message,
    conversationHistory,
  });

  // Try real Gemini API if key is present
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: systemInstructions,
      });

      // Format previous chat history into Gemini contents format
      const formattedHistory = (conversationHistory || []).slice(-6).map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(userPrompt);
      const text = result.response.text();

      // Extract bullet tips if present
      const lines = text.split('\n');
      const tips = lines
        .filter((l) => l.trim().startsWith('-') || l.trim().startsWith('*') || l.trim().match(/^\d+\./))
        .map((l) => l.replace(/^[-*]|\d+\.\s*/, '').trim())
        .filter((l) => l.length > 10 && l.length < 160)
        .slice(0, 3);

      return {
        text,
        actionableTips: tips.length > 0 ? tips : [
          'Stick to a consistent wake time daily',
          'Aim for 10 minutes of morning sunlight',
          'Avoid heavy meals and caffeine within 6 hours of bedtime'
        ],
        source: 'Gemini 1.5 Flash API',
      };
    } catch (apiError) {
      console.warn('[Gemini API Call Failed - Switching to Contextual Fallback]:', apiError.message);
      // Fall through to contextual fallback
    }
  }

  // Fallback engine
  return generateContextualFallback({ user, sleepLogs, message });
}

module.exports = {
  generateSleepAdvice,
  buildSleepPromptContext,
};
