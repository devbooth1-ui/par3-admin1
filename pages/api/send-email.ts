export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { to, subject, body } = req.body

    // Log the email that would be sent
    console.log('📧 EMAIL NOTIFICATION TO:', to)
    console.log('📧 SUBJECT:', subject)
    console.log('📧 BODY:', body)

    // In a real implementation, you would use a service like SendGrid, AWS SES, etc.
    // For demo purposes, we'll just log it and return success

    // Simulate email sending
    setTimeout(() => {
        console.log('✅ Email sent successfully to', to)
    }, 1000)

    res.status(200).json({
        success: true,
        message: `Email notification logged for ${to}`
    })
}
