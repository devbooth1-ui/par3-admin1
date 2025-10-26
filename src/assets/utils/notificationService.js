// Notification service for immediate company alerts
// Current setup: devbooth1@yahoo.com with specialized addresses
// Future setup: par3challenge.com domain with email forwarding

// Company email configuration
const PRIMARY_EMAIL = "devbooth1@yahoo.com";
const AWARDS_EMAIL = "awards@par3challenge.com"; 
const REGISTRATION_EMAIL = "registration@par3challenge.com";
const VIDEO_EMAIL = "video@par3challenge.com";
const COMPANY_NAME = "Par 3 Challenge";

export const notifyCompany = async (prizeData) => {
    const {
        playerName,
        playerEmail,
        prizeType,
        prizeAmount,
        outfitDescription,
        teeDate,
        teeTime,
        timestamp,
        points
    } = prizeData;

    // Create formatted message for company notification
    const message = `
🚨 IMMEDIATE PRIZE CLAIM ALERT 🚨

Prize Type: ${prizeType}
Prize Value: ${prizeAmount}
Player: ${playerName}
Email: ${playerEmail}
Points Earned: ${points}

Verification Details:
- Outfit: ${outfitDescription}
- Date: ${teeDate}
- Time: ${teeTime}
- Submitted: ${timestamp}

Action Required: Verify and process prize claim within 24 hours.
Payment Method: Return to original payment method used for entry.

---
Par 3 Challenge Notification System
Sent to: ${PRIMARY_EMAIL} and ${AWARDS_EMAIL}
  `;

    console.log("📧 PRIZE NOTIFICATION TO:", [PRIMARY_EMAIL, AWARDS_EMAIL]);
    console.log("📧 MESSAGE:", message);

    // Option 1: EmailJS (Client-side email service) - RECOMMENDED FOR NOW
    // Uncomment and configure when ready:
    /*
    try {
      const emailjs = await import('emailjs-com');
      await emailjs.send(
        "YOUR_SERVICE_ID",    // Replace with your EmailJS service ID
        "YOUR_TEMPLATE_ID",   // Replace with your EmailJS template ID
        {
          to_email: COMPANY_EMAIL,  // Currently: devbooth1@yahoo.com
          subject: `🚨 ${prizeType} Prize Claim - ${playerName}`,
          message: message,
          player_name: playerName,
          player_email: playerEmail,
          prize_type: prizeType,
          prize_amount: prizeAmount,
          company_name: COMPANY_NAME
        },
        "YOUR_USER_ID"        // Replace with your EmailJS user ID
      );
      return { success: true, method: "EmailJS", sentTo: COMPANY_EMAIL };
    } catch (error) {
      console.error("EmailJS failed:", error);
    }
    */

    // Option 2: Backend API call (for par3challenge.com domain)
    // Use this when you have par3challenge.com set up with email forwarding:
    /*
    try {
      const response = await fetch('https://api.par3challenge.com/notify-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
          ...prizeData,
          companyEmail: COMPANY_EMAIL,
          notificationType: 'prize_claim'
        })
      });
      
      if (response.ok) {
        return { success: true, method: "Par3Challenge API", sentTo: COMPANY_EMAIL };
      }
    } catch (error) {
      console.error("Par3Challenge API failed:", error);
    }
    */

    // Option 3: Third-party service (SendGrid, Mailgun, etc.)
    // Add your preferred service here

    // For now, return logging confirmation with your current emails
    return {
        success: false,
        message: `Prize notification logged for ${PRIMARY_EMAIL} and ${AWARDS_EMAIL}`,
        pendingEmails: [PRIMARY_EMAIL, AWARDS_EMAIL],
        futureSetup: "par3challenge.com with email forwarding to multiple addresses"
    };
};

// Tournament Registration Notification
export const notifyTournamentRegistration = async (registrationData) => {
    const {
        playerName,
        playerEmail,
        playerPhone,
        registrationDate,
        tournamentId
    } = registrationData;

    const message = `
🏆 TOURNAMENT REGISTRATION ALERT 🏆

Tournament: $1 Million Par3 Challenge Shootout
Player: ${playerName}
Email: ${playerEmail}
Phone: ${playerPhone}
Registration Date: ${registrationDate}
Tournament ID: ${tournamentId}

Action Required: Confirm registration and add to tournament participant list.

---
Par 3 Challenge Tournament Registration System
Sent to: ${PRIMARY_EMAIL} and ${REGISTRATION_EMAIL}
  `;

    console.log("📧 TOURNAMENT REGISTRATION TO:", [PRIMARY_EMAIL, REGISTRATION_EMAIL]);
    console.log("📧 MESSAGE:", message);

    return {
        success: false,
        message: `Tournament registration logged for ${PRIMARY_EMAIL} and ${REGISTRATION_EMAIL}`,
        pendingEmails: [PRIMARY_EMAIL, REGISTRATION_EMAIL],
        futureSetup: "par3challenge.com with email forwarding"
    };
};

// Video Order Notification
export const notifyVideoOrder = async (orderData) => {
    const {
        playerName,
        email,
        phone,
        paymentMethod,
        orderDate,
        amount
    } = orderData;

    const message = `
🎥 VIDEO ORDER NOTIFICATION 🎥

Player: ${playerName}
Email: ${email}
Phone: ${phone}
Payment Method: ${paymentMethod}
Order Date: ${orderDate}
Amount: $${amount}

Action Required: Process video order and deliver within 24 hours.

---
Par 3 Challenge Video Order System
Sent to: ${PRIMARY_EMAIL} and ${VIDEO_EMAIL}
  `;

    console.log("📧 VIDEO ORDER TO:", [PRIMARY_EMAIL, VIDEO_EMAIL]);
    console.log("📧 MESSAGE:", message);

    return {
        success: false,
        message: `Video order logged for ${PRIMARY_EMAIL} and ${VIDEO_EMAIL}`,
        pendingEmails: [PRIMARY_EMAIL, VIDEO_EMAIL],
        futureSetup: "par3challenge.com with email forwarding"
    };
};

// Helper function for testing
export const testNotification = () => {
    const testData = {
        playerName: "Test Player",
        playerEmail: "test@example.com",
        prizeType: "Hole-in-One",
        prizeAmount: "$1,000 CASH + $1M Tournament Entry",
        outfitDescription: "Blue cap, red polo, white pants",
        teeDate: "2025-08-19",
        teeTime: "14:30",
        timestamp: new Date().toLocaleString(),
        points: 1000
    };

    console.log(`🧪 TESTING notification system with emails: ${PRIMARY_EMAIL}, ${AWARDS_EMAIL}, ${REGISTRATION_EMAIL}, ${VIDEO_EMAIL}`);
    return notifyCompany(testData);
};

// Configuration helper for easy email updates
export const updateCompanyEmail = (newEmail) => {
    console.log(`📧 Email configuration update needed:`);
    console.log(`Current Primary: ${PRIMARY_EMAIL}`);
    console.log(`Current Awards: ${AWARDS_EMAIL}`);
    console.log(`Current Registration: ${REGISTRATION_EMAIL}`);
    console.log(`Current Video: ${VIDEO_EMAIL}`);
    console.log(`Requested: ${newEmail}`);
    console.log(`Update the email constants in notificationService.js`);
};