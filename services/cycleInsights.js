import axios from 'axios';

const AZURE_OPENAI_ENDPOINT = 'https://femoraopenai.openai.azure.com';
const AZURE_OPENAI_KEY = '';
const DEPLOYMENT_NAME = 'gpt-4o-mini';

// In-memory cache to store insights for the day
let dailyCache = {
  date: null,
  insights: {}
};

// Reference data for hormone patterns throughout the cycle
const CYCLE_REFERENCE = {
  hormones: [
    { name: "Estrogen", description: "Primary female sex hormone" },
    { name: "Luteinizing Hormone (LH)", description: "Triggers ovulation" },
    { name: "Progesterone", description: "Prepares for pregnancy" },
    { name: "Follicle Stimulating Hormone (FSH)", description: "Stimulates follicle development" }
  ],
  phases: {
    "Menstrual Phase": { typicalDays: "1-5" },
    "Follicular Phase": { typicalDays: "6-14" },
    "Ovulation Phase": { typicalDays: "14-16" },
    "Luteal Phase": { typicalDays: "17-28" }
  }
};

export const generateCycleInsights = async (phase, dayInCycle) => {
  try {
    const today = new Date().toDateString();
    
    // Check if we already generated insights today for this phase and day
    if (dailyCache.date === today && 
        dailyCache.insights[`${phase}_${dayInCycle}`]) {
      console.log('Retrieved cached insights from memory');
      return dailyCache.insights[`${phase}_${dayInCycle}`];
    }
    
    // If no cached data or new day, update cache date
    if (dailyCache.date !== today) {
      dailyCache.date = today;
      dailyCache.insights = {};
    }

    // Generate new insights using Azure OpenAI
    const response = await axios.post(
      `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=2023-05-15`,
      {
        messages: [
          {
            role: "system",
            content: "You are a women's health expert providing insights about hormonal changes during the menstrual cycle. You must respond with valid JSON only, no additional text or formatting."
          },
          {
            role: "user",
            content: `Generate hormone insights for day ${dayInCycle} in the ${phase} phase. Include exactly 3 relevant hormones from this list: Estrogen, Luteinizing Hormone (LH), Progesterone, Follicle Stimulating Hormone (FSH). 
            For each hormone, provide both technical and simplified descriptions.
            Response must be a JSON object with hormone names as keys. 
            Each hormone object must have these fields: 
            "level" (one of: "Maximum", "High", "Moderate", "Low"), 
            "description" (technical description for nerd mode), 
            "interactions" (technical hormone interactions for nerd mode),
            "chillDescription" (simplified, friendly explanation for non-medical users),
            "chillInteractions" (simplified explanation of effects in everyday terms, can be slightly humorous)
            Example: {"Estrogen":{"level":"High","description":"technical text","interactions":"technical interaction","chillDescription":"friendly explanation","chillInteractions":"effects in everyday terms"}}`
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
        n: 1
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_OPENAI_KEY,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.data.choices || !response.data.choices[0]?.message?.content) {
      throw new Error('Invalid response format from Azure OpenAI');
    }

    let insights;
    try {
      const content = response.data.choices[0].message.content.trim();
      insights = JSON.parse(content);
      
      // Validate the response format
      if (typeof insights !== 'object' || Object.keys(insights).length === 0) {
        throw new Error('Invalid insights format');
      }

      // Ensure each hormone has the required fields
      Object.entries(insights).forEach(([hormone, data]) => {
        if (!data.level || !data.description || !data.interactions || 
            !data.chillDescription || !data.chillInteractions) {
          throw new Error(`Missing required fields for hormone: ${hormone}`);
        }
      });

    } catch (parseError) {
      console.error('JSON Parse error:', parseError);
      console.error('Raw content:', response.data.choices[0].message.content);
      throw new Error('Failed to parse insights data');
    }

    // Store in memory cache for today
    dailyCache.insights[`${phase}_${dayInCycle}`] = insights;

    return insights;
  } catch (error) {
    console.error('Error generating cycle insights:', error.message);
    if (error.response?.data) {
      console.error('API Error details:', error.response.data);
    }
    return getFallbackInsights(phase, dayInCycle);
  }
};

const getFallbackInsights = (phase, dayInCycle) => {
  const fallbackData = {
    'Menstrual Phase': {
      "Estrogen": {
        level: "Low",
        description: "Estrogen levels are at their lowest during menstruation.",
        interactions: "Low estrogen and progesterone lead to menstruation",
        chillDescription: "Estrogen's on vacation! It's taking a well-deserved break.",
        chillInteractions: "When estrogen chills out, your period gets the green light to start."
      },
      "Follicle Stimulating Hormone": {
        level: "Moderate",
        description: "FSH begins to rise to stimulate follicle development",
        interactions: "Works with rising estrogen to develop follicles",
        chillDescription: "FSH is warming up, getting ready to grow some egg homes.",
        chillInteractions: "It's like a coach preparing your body for the next cycle's main event."
      },
      "Progesterone": {
        level: "Low",
        description: "Progesterone levels are minimal during menstruation",
        interactions: "Decreasing progesterone triggers menstrual flow",
        chillDescription: "Progesterone is laying low right now.",
        chillInteractions: "When progesterone drops, it's your body's way of saying 'time to reset!'"
      }
    },
    'Follicular Phase': {
      "Estrogen": {
        level: "High",
        description: "Estrogen levels rise steadily as follicles develop",
        interactions: "Rising estrogen triggers LH surge",
        chillDescription: "Estrogen is on the rise! You might feel more energetic and upbeat.",
        chillInteractions: "Think of it as your body's natural mood booster kicking in."
      },
      "Luteinizing Hormone": {
        level: "Moderate",
        description: "LH begins to increase gradually",
        interactions: "Prepares for the upcoming surge",
        chillDescription: "LH is slowly building up, getting ready for its big moment.",
        chillInteractions: "It's like your body is charging its batteries for ovulation."
      },
      "Follicle Stimulating Hormone": {
        level: "High",
        description: "FSH stimulates follicle growth",
        interactions: "Works with estrogen to develop follicles",
        chillDescription: "FSH is working overtime to prep your eggs.",
        chillInteractions: "It's the project manager making sure everything's ready for release day."
      }
    },
    'Ovulation Phase': {
      "Luteinizing Hormone": {
        level: "Maximum",
        description: "LH surge triggers ovulation",
        interactions: "Peak levels cause follicle rupture",
        chillDescription: "LH is having its big moment! It's showtime for this hormone.",
        chillInteractions: "It basically yells 'Release the egg!' and your ovary listens."
      },
      "Estrogen": {
        level: "Maximum",
        description: "Peaks just before ovulation",
        interactions: "High levels improve fertility signs",
        chillDescription: "Estrogen is peaking! You might feel extra awesome right now.",
        chillInteractions: "Your skin might glow, and you might feel more social and confident."
      },
      "Progesterone": {
        level: "Low",
        description: "Begins to rise after ovulation",
        interactions: "Prepares for possible implantation",
        chillDescription: "Progesterone is just starting to wake up.",
        chillInteractions: "It's getting ready to make your body a comfy potential baby nest."
      }
    },
    'Luteal Phase': {
      "Progesterone": {
        level: "High",
        description: "Progesterone dominates this phase",
        interactions: "Works with decreasing estrogen",
        chillDescription: "Progesterone is running the show now!",
        chillInteractions: "It might make you crave comfort foods and cozy vibes."
      },
      "Estrogen": {
        level: "Moderate",
        description: "Secondary peak then gradual decline",
        interactions: "Balanced with progesterone",
        chillDescription: "Estrogen has a small comeback before chilling out again.",
        chillInteractions: "The up and down can contribute to those pre-period mood swings."
      },
      "Luteinizing Hormone": {
        level: "Low",
        description: "Returns to baseline after ovulation",
        interactions: "Maintains corpus luteum initially",
        chillDescription: "LH is taking a well-deserved rest after its big performance.",
        chillInteractions: "It's basically saying 'my job here is done' until next month."
      }
    }
  };

  return fallbackData[phase] || {
    "Estrogen": {
      level: "Moderate",
      description: "Hormone levels vary throughout your cycle",
      interactions: "Multiple hormones work together to regulate your cycle",
      chillDescription: "Estrogen is doing its thing, helping your cycle along.",
      chillInteractions: "It's like the director of your body's monthly show."
    },
    "Luteinizing Hormone": {
      level: "Moderate",
      description: "LH levels fluctuate throughout the cycle",
      interactions: "Works with other hormones to maintain cycle",
      chillDescription: "LH is hanging around, ready when needed.",
      chillInteractions: "Think of it as your body's backstage manager."
    },
    "Progesterone": {
      level: "Moderate",
      description: "Progesterone levels change throughout the cycle",
      interactions: "Balances with other reproductive hormones",
      chillDescription: "Progesterone is playing its part in your cycle.",
      chillInteractions: "It helps keep everything running on schedule."
    }
  };
};