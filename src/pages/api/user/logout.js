export default async function handler(req, res) {
    if (req.method === 'GET') {
        res.setHeader('Set-Cookie', `user-token=; HttpOnly; Max-Age=0; Path=/`);
        res.status(202).json({message: 'successful', success: true});
    }
}
