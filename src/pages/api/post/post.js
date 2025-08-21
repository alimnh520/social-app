export default async function handler(req, res) {
    try {

        res.status(202).json({ message: 'success', success: true });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: '', success: false });
    }
}