async function listModels() {
  const apiKey = "AIzaSyDYFJh3h8weo7mPRp80tueJAtkkARcuD2M";
  
  try {
    console.log("Listing models...");
    const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await result.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
