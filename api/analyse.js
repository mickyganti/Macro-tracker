export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
 
  const { system, content } = req.body;
  if (!system || !content) return res.status(400).json({ error: 'Missing required fields' });
 
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
        max_tokens: 600,
        system,
        messages: [{ role: 'user', content }],
      }),
    });
 
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Anthropic API error');
    res.status(200).json({ result: data.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
 
