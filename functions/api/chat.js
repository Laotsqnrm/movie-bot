export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { message } = await request.json();

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
    let debugInfo = '';
    
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 1000));
      
      const msgRes = await fetch(
        'https://api.coze.cn/v3/chat/message/list?chat_id=' + chatId + '&conversation_id=' + conversationId,
        { headers: { 'Authorization': 'Bearer ' + PAT } }
      );
      
      const msgData = await msgRes.json();
      const messages = msgData.data || [];
      
      // 记录所有消息类型，方便调试
      if (i === 5) {
        const types = messages.map(m => m.type).join(',');
        debugInfo = ' 第5秒消息类型: ' + types;
      }
      
      const answer = messages.find(m => m.type === 'answer');
      if (answer) {
        reply = answer.content;
        break;
      }
    }

    return Response.json({ reply: reply || ('超时了' + debugInfo) });
  } catch (e) {
    return Response.json({ reply: '异常：' + e.message });
  }
}
