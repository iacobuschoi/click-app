import { Client } from 'pg';

export default async function handler(req, res) {
    const { username, score } = req.body;

    const client = new Client({
        connectionString: process.env.POSTGRES_URL,
    });

    try {
        await client.connect();
        const result = await client.query('INSERT INTO scores (username, score) VALUES ($1, $2)', [username, score]);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error saving score:", error);
        res.status(500).json({ success: false });
    } finally {
        await client.end();
    }
}
