// ...imports and other code above...

const onSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // Frontend validation: required fields
  if (!outfit.trim() || !teeDate.trim() || !teeTime.trim()) {
    setError("All fields are required.");
    return;
  }
  if (!playerName.trim() || !playerEmail.trim()) {
    setError("Player name and email are required.");
    return;
  }
  if (!courseName.trim()) {
    setError("Course name is required for verification.");
    return;
  }

  // Compose claimData with fields from form and hidden/localStorage
  const claimData = {
    claimType,
    playerName,
    playerEmail,
    outfitDescription: outfit,
    teeDate,
    teeTime,
    courseName // hidden, auto-included
  };

  // ===== ADD THIS LINE! =====
  console.log("Sending claimData:", claimData);

  try {
    await sendClaimEmail(claimData);
    alert("Your submission is under review. You will receive an email when your hole has been reviewed by our team.");
    navigate("/myscorecard", {
      state: { prize: state.prize, outfit, teeDate, teeTime },
    });
  } catch (error) {
    setError("Claim submission failed. Please contact support.");
  }
};
