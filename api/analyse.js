export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
 
  const { system, content } = req.body;
  if (!system || !content) return res.status(400).json({ error: 'Missing required fields' });
 
  // content can be either:
  // - a single-turn array of content blocks: [{type:'text',text:'...'}]
  // - a multi-turn messages array: [{role:'user',content:[...]}, {role:'assistant',content:[...]}]
  const isMultiTurn = Array.isArray(content) && content.length > 0 && content[0].role;
  const messages = isMultiTurn ? content : [{ role: 'user', content }];
 
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 2000,
        temperature: 0,
        system,
        messages,
      }),
    });
 
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Anthropic API error');
    res.status(200).json({ result: data.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
 
