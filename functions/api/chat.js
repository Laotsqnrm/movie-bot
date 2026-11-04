export async function onRequestPost(context) {
  const { request, env } = context;
  const { message } = await request.json();

  // token 从环境变量读，不写在代码里
  const PAT = env.PAT;
  const BOT_ID = '7703789015912284179';

  const chatRes = await fetch('https://api.coze.cn/v3/chat', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + PAT,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      bot_id: BOT_ID,
      user_id: 'movie_user_001',
      stream: false,
      auto_save_history: true,
      additional_messages: [{
        role: 'user',
        content: message,
        content_type: 'text'
      }]
    })
  });

  const chatData = await chatRes.json();
  const chatId = chatData.data.id;
  const conversationId = chatData.data.conversation_id;

  let reply = '';
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const msgRes = await fetch(
      'https://api.coze.cn/v3/chat/message/list?chat_id=' + chatId + '&conversation_id=' + conversationId,
      { headers: { 'Authorization': 'Bearer ' + PAT } }
    );
    const msgData = await msgRes.json();
    const answer = (msgData.data || []).find(m => m.type === 'answer');
    if (answer) {
      reply = answer.content;
      break;
    }
  }

  return Response.json({ reply: reply || '超时了，再试一次' });
}
