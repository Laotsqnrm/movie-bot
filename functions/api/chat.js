export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { message } = await request.json();

    const PAT = env.PAT;
    const BOT_ID = '7703789015912284179';

    // 发起对话
    const chatRes = await fetch('https://api.coze.cn/v3/chat', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + PAT1,
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

    // 等对话完成
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const statusRes = await fetch(
        'https://api.coze.cn/v3/chat/retrieve?chat_id=' + chatId + '&conversation_id=' + conversationId,
        { headers: { 'Authorization': 'Bearer ' + PAT } }
      );
      const statusData = await statusRes.json();
      if (statusData.data?.status === 'completed') break;
    }

    // 查消息列表，提取 answer
    const msgRes = await fetch(
      'https://api.coze.cn/v3/chat/message/list?chat_id=' + chatId + '&conversation_id=' + conversationId,
      { headers: { 'Authorization': 'Bearer ' + PAT } }
    );
    const msgData = await msgRes.json();
    const messages = msgData.data || [];
    const answer = messages.find(m => m.type === 'answer');

    return Response.json({ reply: answer?.content || '没拿到回答，再试一次' });
  } catch (e) {
    return Response.json({ reply: '出错了：' + e.message });
  }
}
