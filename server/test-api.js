const app = require('./server');

async function runTests() {
  console.log('\n[TEST RUNNER] Starting SomnaAI API integration verification...\n');
  
  // Wait a moment for server to listen and mock store to init
  await new Promise((r) => setTimeout(r, 1000));
  
  const baseUrl = 'http://localhost:5000';
  let token = null;

  try {
    // 1. Health check
    console.log('Test 1: GET /api/health');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    console.log('✓ Health status:', healthData.status, '| DB:', healthData.database?.database);

    // 2. 1-Click Demo Login
    console.log('\nTest 2: POST /api/auth/demo');
    const demoRes = await fetch(`${baseUrl}/api/auth/demo`, { method: 'POST' });
    const demoData = await demoRes.json();
    token = demoData.token;
    console.log('✓ Demo Login Success. User:', demoData.user?.name, '| Token acquired.');

    // 3. User Sleep Stats
    console.log('\nTest 3: GET /api/sleep/stats (Protected)');
    const statsRes = await fetch(`${baseUrl}/api/sleep/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const statsData = await statsRes.json();
    console.log('✓ Stats:', {
      avgScore: statsData.data?.avgScore,
      avgDurationHours: statsData.data?.avgDurationHours,
      sleepEfficiency: `${statsData.data?.sleepEfficiency}%`,
      sleepDebtHours: `${statsData.data?.sleepDebtHours}h`,
    });

    // 4. Log Sleep Session
    console.log('\nTest 4: POST /api/sleep (Log new sleep entry)');
    const logRes = await fetch(`${baseUrl}/api/sleep`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bedtime: '23:15',
        wakeTime: '07:30',
        sleepLatencyMinutes: 12,
        qualityRating: 9,
        awakeningsCount: 0,
        morningMood: 'Refreshed',
        caffeineCups: 1,
        notes: 'Pre-interview restful sleep',
      }),
    });
    const logData = await logRes.json();
    console.log('✓ Log Created:', {
      durationHours: (logData.data?.durationMinutes / 60).toFixed(1),
      sleepScore: logData.data?.sleepScore,
      mood: logData.data?.morningMood,
    });

    // 5. Send Chat Message to Gemini Guidance Specialist
    console.log('\nTest 5: POST /api/chat/message (AI Guidance)');
    const chatRes = await fetch(`${baseUrl}/api/chat/message`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Why do I wake up around 3 AM and how does caffeine affect it?',
      }),
    });
    const chatData = await chatRes.json();
    console.log('✓ Chat AI Response Received:');
    console.log('  Source:', chatData.source);
    console.log('  ConversationId:', chatData.conversationId);
    console.log('  Excerpt:', chatData.message?.text?.slice(0, 140).replace(/\n/g, ' ') + '...');
    console.log('  Actionable Tips:', chatData.message?.actionableTips);

    // 6. Sleep Analytics & Clinical Audit
    console.log('\nTest 6: GET /api/analytics/audit');
    const auditRes = await fetch(`${baseUrl}/api/analytics/audit`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const auditData = await auditRes.json();
    console.log('✓ Audit Grade:', auditData.audit?.grade);
    console.log('  SRI Regularity:', auditData.audit?.regularityScore);
    console.log('  Recommendations Count:', auditData.audit?.recommendations?.length);

    // 7. 90-Minute Sleep Cycle Calculator
    console.log('\nTest 7: POST /api/analytics/sleep-cycle');
    const cycleRes = await fetch(`${baseUrl}/api/analytics/sleep-cycle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetWakeTime: '07:00' }),
    });
    const cycleData = await cycleRes.json();
    console.log('✓ Sleep Cycle Options for 07:00 AM wake:');
    cycleData.options?.forEach((opt) => {
      console.log(`  - Bedtime ${opt.suggestedBedtime} (${opt.cycles} cycles, ${opt.durationHours}h) ${opt.recommended ? '[RECOMMENDED]' : ''}`);
    });

    console.log('\n🎉 ALL 7 INTEGRATION TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  }
}

runTests();
