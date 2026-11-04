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

    // 查消息列表，返回原始数据
    const msgRes = await fetch(
      'https://api.coze.cn/v3/chat/message/list?chat_id=' + chatId + '&conversation_id=' + conversationId,
      { headers: { 'Authorization': 'Bearer ' + PAT } }
    );
    const msgData = await msgRes.json();
    
    return Response.json({ reply: JSON.stringify(msgData) });
  } catch (e) {
    return Response.json({ reply: '异常：' + e.message });
  }
}
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

    // 查3次状态
    let statusInfo = '';
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 2000));
      
      const statusRes = await fetch(
        'https://api.coze.cn/v3/chat/retrieve?chat_id=' + chatId + '&conversation_id=' + conversationId,
        { headers: { 'Authorization': 'Bearer ' + PAT } }
      );
      const statusData = await statusRes.json();
      statusInfo += ' 第' + ((i+1)*2) + '秒: ' + (statusData.data?.status || JSON.stringify(statusData));
    }

    // 查消息列表
    const msgRes = await fetch(
      'https://api.coze.cn/v3/chat/message/list?chat_id=' + chatId + '&conversation_id=' + conversationId,
      { headers: { 'Authorization': 'Bearer ' + PAT } }
    );
    const msgData = await msgRes.json();
    
    return Response.json({ reply: '状态：' + statusInfo + '\n消息：' + JSON.stringify(msgData.data) });
  } catch (e) {
    return Response.json({ reply: '异常：' + e.message });
  }
}
