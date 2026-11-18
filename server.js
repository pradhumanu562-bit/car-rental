/**
 * DriveEase - Premium Car Rental Backend Server
 * Provides static website hosting and a secure AI Chatbot API proxy.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// DriveEase Fleet Knowledge Base for AI System Prompts & Fallback
const FLEET_DATA = [
  {
    id: 'porsche-911',
    name: 'Porsche 911 Carrera GTS',
    category: 'Sports / Luxury',
    pricePerDay: 380,
    seats: 2,
    transmission: 'Automatic PDK',
    fuel: 'Petrol (Twin-Turbo)',
    features: ['Sport Chrono Package', 'Bose Surround Sound', '0-60 in 3.2s', 'Active Aerodynamics'],
    deposit: 1500,
    minAge: 25
  },
  {
    id: 'mercedes-s-class',
    name: 'Mercedes-Benz S-Class S580',
    category: 'Luxury Sedan',
    pricePerDay: 320,
    seats: 5,
    transmission: '9-Speed Automatic',
    fuel: 'Mild Hybrid (4.0L V8)',
    features: ['Executive Rear Seating', 'Burmester 3D Sound', 'Massage Seats', 'Air Suspension'],
    deposit: 1000,
    minAge: 23
  },
  {
    id: 'range-rover',
    name: 'Range Rover Autobiography',
    category: 'Luxury SUV',
    pricePerDay: 290,
    seats: 5,
    transmission: 'Automatic AWD',
    fuel: 'Petrol (4.4L V8)',
    features: ['All-Terrain Response', 'Panoramic Glass Roof', 'Deployable Steps', 'Meridian Signature Sound'],
    deposit: 1000,
    minAge: 23
  },
  {
    id: 'tesla-model-s',
    name: 'Tesla Model S Plaid',
    category: 'Electric / Sedan',
    pricePerDay: 220,
    seats: 5,
    transmission: 'Direct Drive AWD',
    fuel: '100% Electric (1020 hp)',
    features: ['Tri-Motor 0-60 in 1.99s', 'Full Self-Driving Capable', '396 Mile Range', 'Gaming Computer'],
    deposit: 800,
    minAge: 21
  },
  {
    id: 'bmw-m4',
    name: 'BMW M4 Competition Coupe',
    category: 'Sports',
    pricePerDay: 260,
    seats: 4,
    transmission: '8-Speed M Steptronic',
    fuel: 'Petrol (3.0L M TwinPower)',
    features: ['M Carbon Bucket Seats', 'M Drift Analyzer', 'Head-Up Display', 'Harman Kardon'],
    deposit: 1000,
    minAge: 25
  },
  {
    id: 'lamborghini-urus',
    name: 'Lamborghini Urus Pearl Capsule',
    category: 'Luxury SUV / Supercar',
    pricePerDay: 550,
    seats: 5,
    transmission: '8-Speed Automatic AWD',
    fuel: 'Petrol (4.0L Twin-Turbo V8)',
    features: ['641 Horsepower', 'Carbon Ceramic Brakes', 'B&O 3D Sound', 'Anima Drive Modes'],
    deposit: 2000,
    minAge: 25
  },
  {
    id: 'audi-rs7',
    name: 'Audi RS7 Sportback',
    category: 'Luxury Sedan',
    pricePerDay: 275,
    seats: 5,
    transmission: '8-Speed Tiptronic Quattro',
    fuel: 'Petrol (4.0L Twin-Turbo V8)',
    features: ['RS Dynamic Package', 'Valcona Leather', 'Bang & Olufsen 3D', 'Night Vision Assist'],
    deposit: 1000,
    minAge: 23
  },
  {
    id: 'mustang-mache',
    name: 'Ford Mustang Mach-E GT',
    category: 'Electric SUV',
    pricePerDay: 150,
    seats: 5,
    transmission: 'Single-Speed AWD',
    fuel: '100% Electric (480 hp)',
    features: ['Brembo Brakes', 'MagneRide Damping', 'Ford Co-Pilot360', 'B&O Audio'],
    deposit: 500,
    minAge: 21
  },
  {
    id: 'bmw-7-series',
    name: 'BMW 7 Series 760i xDrive',
    category: 'Luxury Sedan',
    pricePerDay: 310,
    seats: 5,
    transmission: '8-Speed Steptronic Sport',
    fuel: 'Twin-Turbo V8 Mild Hybrid',
    features: ['31.3" 8K Theater Screen', 'Sky Lounge LED Roof', 'Automatic Doors', 'Bowers & Wilkins Diamond'],
    deposit: 1000,
    minAge: 23
  },
  {
    id: 'cadillac-escalade',
    name: 'Cadillac Escalade ESV',
    category: 'Luxury SUV',
    pricePerDay: 280,
    seats: 7,
    transmission: '10-Speed Automatic',
    fuel: 'Petrol (6.2L V8)',
    features: ['Super Cruise Hands-Free', '38" Curved OLED Display', 'AKG 36-Speaker Audio', 'Refrigerated Console'],
    deposit: 1000,
    minAge: 23
  }
];

const SYSTEM_PROMPT = `You are DriveBot, the friendly, professional, and knowledgeable AI assistant for DriveEase - a premium luxury car rental service.
Your tone is sophisticated, helpful, welcoming, and concise.

DriveEase Fleet details:
${FLEET_DATA.map(c => `- ${c.name} (${c.category}): $${c.pricePerDay}/day, ${c.seats} seats, ${c.transmission}, ${c.fuel}. Min Age: ${c.minAge}, Security Deposit: $${c.deposit}. Features: ${c.features.join(', ')}`).join('\n')}

Key Policies & FAQs:
- Locations: JFK Airport (NY), LAX Airport (CA), Miami Downtown & MIA Airport (FL), Las Vegas Strip (NV), Chicago O'Hare (IL), San Francisco (CA). Free doorstep delivery to luxury hotels or private addresses within 20 miles.
- Fuel/Charge Policy: Full-to-Full or 80%+ battery. Return at same level or pay standard refuel charge.
- Age Requirements: Standard luxury cars require driver to be 21+. High-performance supercars (Porsche 911, Lamborghini Urus, BMW M4) require age 25+.
- What is needed to rent: Valid physical driver's license (held for at least 1 year), major credit card for deposit, passport if international renter.
- Included Insurance: Base liability is included. Optional Full Coverage Damage Waiver available for $25/day.
- Cancellation Policy: 100% full refund if cancelled at least 24 hours prior to scheduled pickup.
- Active Promo Codes:
  * "WELCOME10" - 10% off any first booking
  * "WEEKEND20" - 20% off bookings of 3 days or more
- Booking Process: Users can select dates on the website, pick any vehicle from the fleet, customize insurance/add-ons, and confirm instantly.

Instructions for your response:
1. Always be polite, modern, and enthusiastic.
2. If the user asks for car recommendations, suggest specific vehicles from the fleet with their daily price and why they fit (e.g. business vs sports thrill vs family trip).
3. If they ask about prices, provide the exact daily rate from the fleet list.
4. Keep answers readable with markdown bullet points or brief paragraphs. Avoid overly long walls of text.
5. Remind them they can click "Book Now" directly on any car card on the website to reserve in 60 seconds!`;

// Smart Built-in Fallback Knowledge Engine (used when no external API key is set or when offline)
function generateSmartFallbackResponse(userMessage) {
  const msg = userMessage.toLowerCase().trim();

  // 1. Greetings
  if (/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy)\b/i.test(msg) && msg.length < 25) {
    return `Hello! Welcome to **DriveEase Concierge**. 🚗✨\n\nI'm **DriveBot**, your AI automotive specialist. How can I assist you today?\n\n• Browse our luxury & exotic fleet\n• Compare rental rates & specs\n• Understand booking requirements\n• Get personalized car recommendations\n• Learn about airport delivery`;
  }

  // 2. Specific Car Queries
  if (msg.includes('porsche') || msg.includes('911')) {
    const car = FLEET_DATA.find(c => c.id === 'porsche-911');
    return `🏁 **${car.name}**\n\n• **Rate:** $${car.pricePerDay}/day\n• **Category:** ${car.category} (2 Seats)\n• **Specs:** ${car.transmission}, ${car.fuel}\n• **Highlights:** ${car.features.join(' • ')}\n• **Requirements:** Driver age 25+, $${car.deposit} refundable deposit.\n\nReady for an exhilarating drive? Click **"Book Now"** on the Porsche card to secure your dates!`;
  }

  if (msg.includes('lamborghini') || msg.includes('urus')) {
    const car = FLEET_DATA.find(c => c.id === 'lamborghini-urus');
    return `🐂 **${car.name}**\n\n• **Rate:** $${car.pricePerDay}/day (Our premier exotic SUV)\n• **Category:** ${car.category} (5 Seats)\n• **Engine:** 641 hp Twin-Turbo V8 AWD\n• **Highlights:** ${car.features.join(' • ')}\n• **Requirements:** Age 25+, $${car.deposit} deposit.\n\nExperience the pinnacle of supercar power and luxury SUV space!`;
  }

  if (msg.includes('mercedes') || msg.includes('s-class') || msg.includes('s580') || msg.includes('maybach')) {
    const car = FLEET_DATA.find(c => c.id === 'mercedes-s-class');
    return `⭐ **${car.name}**\n\n• **Rate:** $${car.pricePerDay}/day\n• **Category:** Executive Luxury Sedan\n• **Highlights:** Burmester 3D Sound, Active Massage Seats, Airmatic Suspension.\n• **Ideal For:** VIP business travel, red-carpet events, or supreme highway cruising.`;
  }

  if (msg.includes('tesla') || msg.includes('model s') || msg.includes('plaid')) {
    const car = FLEET_DATA.find(c => c.id === 'tesla-model-s');
    return `⚡ **${car.name}**\n\n• **Rate:** $${car.pricePerDay}/day\n• **Performance:** 1,020 Horsepower (0-60 mph in 1.99s!)\n• **Range:** ~396 miles per full charge\n• **Tech:** Yoke steering, Full Self-Driving capabilities, 22-speaker audio\n• **Free Supercharging:** Compatible with the global Tesla Supercharger network!`;
  }

  if (msg.includes('range rover') || msg.includes('autobiography')) {
    const car = FLEET_DATA.find(c => c.id === 'range-rover');
    return `🏔️ **${car.name}**\n\n• **Rate:** $${car.pricePerDay}/day\n• **Capacity:** 5 Passengers + Large Cargo Area\n• **Features:** All-Terrain Response AWD, Panoramic Roof, Meridian Signature Sound.\n• **Ideal For:** Mountain escapes, family luxury travel, and all-weather road trips.`;
  }

  if (msg.includes('bmw') || msg.includes('m4') || msg.includes('7 series')) {
    return `🏎️ **DriveEase BMW Collection**:\n\n1. **BMW M4 Competition Coupe**: $260/day (503 hp, M Carbon Seats, pure athletic performance)\n2. **BMW 7 Series 760i xDrive**: $310/day (Executive limousine with 31.3" 8K Theater Screen and Sky Lounge LED Roof)\n\nWhich style suits your trip better: athletic performance or executive luxury?`;
  }

  if (msg.includes('cadillac') || msg.includes('escalade') || msg.includes('7 seater') || msg.includes('7 seat') || msg.includes('family') || msg.includes('large group')) {
    const car = FLEET_DATA.find(c => c.id === 'cadillac-escalade');
    return `👑 **${car.name} (7-Passenger Executive SUV)**\n\n• **Rate:** $${car.pricePerDay}/day\n• **Seating:** 7 full-size adult seats with generous luggage room\n• **Features:** Super Cruise hands-free driving, 38" Curved OLED Display, AKG 36-Speaker Studio Audio\n• **Perfect For:** Executive groups, VIP family vacations, and airport delegations.`;
  }

  // 3. Electric & Green
  if (msg.includes('electric') || msg.includes('ev') || msg.includes('green') || msg.includes('battery')) {
    return `🌱 **DriveEase Electric Fleet**:\n\n1. **Tesla Model S Plaid** - $220/day (1,020 hp, 396 mi range, 0-60 in 1.99s)\n2. **Ford Mustang Mach-E GT** - $150/day (480 hp, stylish electric SUV, 5 seats)\n\nAll EV rentals include free charging adapter kits and 80%+ battery charge upon pickup!`;
  }

  // 4. Recommendation based on budget / occasion
  if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('help me choose') || msg.includes('which car') || msg.includes('best car')) {
    return `I would love to help you find the perfect match! 🎯\n\n• **For Adrenaline & Thrill:** Porsche 911 Carrera GTS ($380/day) or BMW M4 Competition ($260/day)\n• **For Supreme Luxury & Prestige:** Mercedes-Benz S-Class S580 ($320/day) or BMW 7 Series ($310/day)\n• **For Ultimate Exotics:** Lamborghini Urus ($550/day)\n• **For Tech & Speed:** Tesla Model S Plaid ($220/day)\n• **For Families & Groups:** Cadillac Escalade 7-Seater ($280/day) or Range Rover ($290/day)\n• **For Best Value:** Ford Mustang Mach-E GT ($150/day)\n\nTell me your preferred style or budget, and I'll tailor it further!`;
  }

  // 5. Pricing, Rates, and Discounts
  if (msg.includes('price') || msg.includes('cost') || msg.includes('rate') || msg.includes('cheap') || msg.includes('affordable') || msg.includes('how much')) {
    return `💰 **DriveEase Transparent Pricing**:\n\nOur daily rates range from **$150/day** up to **$550/day**:\n• **Ford Mustang Mach-E GT:** $150/day\n• **Tesla Model S Plaid:** $220/day\n• **BMW M4 Competition:** $260/day\n• **Audi RS7 Sportback:** $275/day\n• **Cadillac Escalade:** $280/day\n• **Range Rover Autobiography:** $290/day\n• **BMW 760i xDrive:** $310/day\n• **Mercedes-Benz S-Class:** $320/day\n• **Porsche 911 Carrera GTS:** $380/day\n• **Lamborghini Urus:** $550/day\n\n🎉 **Promo Codes Available:**\n• Use code **"WELCOME10"** for **10% OFF** your first booking!\n• Use code **"WEEKEND20"** for **20% OFF** trips of 3+ days!`;
  }

  // 6. Promo code query
  if (msg.includes('promo') || msg.includes('discount') || msg.includes('coupon') || msg.includes('code') || msg.includes('voucher')) {
    return `🎁 **Exclusive Active Promo Codes**:\n\n1. **WELCOME10** — Get **10% OFF** your entire reservation (valid for all first-time renters).\n2. **WEEKEND20** — Get **20% OFF** when booking 3 or more days.\n\n*Enter your promo code in the Booking Form checkout step for instant savings!*`;
  }

  // 7. Requirements, Age, License, Deposit
  if (msg.includes('requirement') || msg.includes('age') || msg.includes('license') || msg.includes('deposit') || msg.includes('rules') || msg.includes('documents')) {
    return `📋 **DriveEase Rental Requirements**:\n\n1. **Driver Age:** Minimum age is **21** for most vehicles. High-performance supercars (Porsche 911, Lamborghini Urus, BMW M4) require **25+**.\n2. **Valid Driver's License:** Physical, unexpired license held for at least 1 year. International renters require a passport + International Driving Permit (or home country license in English).\n3. **Payment & Security Deposit:** Major credit card in driver's name. A refundable deposit ($500–$2,000 depending on vehicle) is held during rental and released upon return.\n4. **Clean Record:** Valid driving record with no major violations in past 3 years.`;
  }

  // 8. Fuel / Battery Policy
  if (msg.includes('fuel') || msg.includes('gas') || msg.includes('petrol') || msg.includes('charge') || msg.includes('charging') || msg.includes('policy')) {
    return `⛽ **Fuel & EV Charging Policy**:\n\n• **Full-to-Full Policy:** Every petrol and hybrid vehicle is delivered with a full tank. Simply return it with a full tank to avoid refueling service fees.\n• **Electric Vehicles:** Handed over with at least 80% charge. You may return it at 70%+ without extra fees.\n• **Premium Fuel Only:** All our high-performance engines require 91+ Octane premium unleaded fuel. Receipts should be kept in glovebox.`;
  }

  // 9. Locations, Pickup, Airport Delivery
  if (msg.includes('location') || msg.includes('pickup') || msg.includes('dropoff') || msg.includes('return') || msg.includes('airport') || msg.includes('delivery')) {
    return `📍 **DriveEase Pickup & Delivery Locations**:\n\n• **Major Airports:** JFK (New York), LAX (Los Angeles), MIA (Miami), LAS (Las Vegas), ORD (Chicago), SFO (San Francisco).\n• **VIP Airport Meet & Greet:** Our concierge meets you curbside right outside your terminal with the keys ready.\n• **Doorstep White-Glove Delivery:** We deliver directly to your private home, luxury hotel, or corporate office within a 20-mile radius for zero hassle.\n• **One-Way Rentals:** Available between select metro locations upon request.`;
  }

  // 10. Insurance and Coverage
  if (msg.includes('insurance') || msg.includes('coverage') || msg.includes('accident') || msg.includes('damage') || msg.includes('waiver')) {
    return `🛡️ **Insurance & Protection Options**:\n\n1. **Standard Liability (Included):** Meets state statutory minimums at no extra charge.\n2. **Full Coverage Damage Waiver (+$25/day):** Reduces physical damage deductible to $0 and covers roadside assistance.\n3. **Personal Auto Insurance:** You may use your personal insurance or premium credit card auto rental coverage (e.g. Amex Premium Car Rental Protection). Just show proof of active coverage at pickup.`;
  }

  // 11. Cancellation & Booking changes
  if (msg.includes('cancel') || msg.includes('refund') || msg.includes('change') || msg.includes('modify')) {
    return `🔄 **Flexible Cancellation Policy**:\n\n• **100% Free Cancellation:** Cancel anytime up to **24 hours prior** to your scheduled pickup for an immediate, full refund.\n• **Zero Hidden Fees:** What you see is what you pay. Transparent daily rates, tax breakdown, and clear security deposit policies.\n• Manage or cancel your bookings anytime directly via the **"My Bookings"** tab on our website!`;
  }

  // 12. How to Book
  if (msg.includes('how to book') || msg.includes('book') || msg.includes('reserve') || msg.includes('order')) {
    return `⚡ **Booking is Fast & Easy in 4 Steps**:\n\n1. **Select Vehicle:** Browse the fleet below or use our search bar to filter by category (SUV, Sedan, Sports, Electric).\n2. **Click "Book Now":** Choose your pickup and return dates & locations.\n3. **Customize:** Add optional insurance or child safety seat, and apply your promo code (e.g. **"WELCOME10"**).\n4. **Instant Confirmation:** Submit your contact details. You'll receive a digital confirmation receipt and booking reference instantly!`;
  }

  // Default contextual fallback
  return `Thank you for asking about **"${userMessage}"**! 🚗\n\nAt **DriveEase**, we pride ourselves on providing the world's finest luxury and performance vehicles with transparent pricing, 24/7 concierge support, and seamless airport or doorstep delivery.\n\nWould you like me to:\n1. Show you our available **Supercars & Sports Coupes**?\n2. Show our spacious **Executive Sedans & 7-Seater SUVs**?\n3. Help you check **rates and active discount codes**?\n4. Guide you through the quick **reservation process**?`;
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'DriveEase Backend API',
    aiProvider: process.env.GEMINI_API_KEY ? 'Gemini AI' : (process.env.OPENAI_API_KEY ? 'OpenAI' : 'Built-in Intelligent Engine'),
    timestamp: new Date().toISOString()
  });
});

// API Fleet endpoint
app.get('/api/fleet', (req, res) => {
  res.json({
    success: true,
    count: FLEET_DATA.length,
    cars: FLEET_DATA
  });
});

// Main Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const trimmedMsg = message.trim();

    // 1. Check for Google Gemini API Key
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        // Prepare chat history if provided
        const contents = [];
        // Add system instruction via user/model initial context or systemInstruction field
        contents.push({
          role: 'user',
          parts: [{ text: `System instruction for this conversation:\n${SYSTEM_PROMPT}\n\nPlease acknowledge with a short ready status.` }]
        });
        contents.push({
          role: 'model',
          parts: [{ text: `Understood! I am DriveBot, DriveEase's luxury car rental concierge. I am ready to assist customers.` }]
        });

        if (Array.isArray(history)) {
          history.slice(-6).forEach(h => {
            contents.push({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: h.text }]
            });
          });
        }

        contents.push({
          role: 'user',
          parts: [{ text: trimmedMsg }]
        });

        const geminiRes = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500
            }
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return res.json({
              success: true,
              reply: reply,
              provider: 'Gemini AI'
            });
          }
        } else {
          console.warn('Gemini API call returned non-200, falling back to smart engine.');
        }
      } catch (err) {
        console.error('Error invoking Gemini API:', err.message);
      }
    }

    // 2. Check for OpenAI API Key
    if (process.env.OPENAI_API_KEY) {
      try {
        const messages = [
          { role: 'system', content: SYSTEM_PROMPT }
        ];

        if (Array.isArray(history)) {
          history.slice(-6).forEach(h => {
            messages.push({
              role: h.role === 'user' ? 'user' : 'assistant',
              content: h.text
            });
          });
        }

        messages.push({ role: 'user', content: trimmedMsg });

        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 0.7,
            max_tokens: 450
          })
        });

        if (openAiRes.ok) {
          const openAiData = await openAiRes.json();
          const reply = openAiData.choices?.[0]?.message?.content;
          if (reply) {
            return res.json({
              success: true,
              reply: reply,
              provider: 'OpenAI GPT'
            });
          }
        } else {
          console.warn('OpenAI API call returned non-200, falling back to smart engine.');
        }
      } catch (err) {
        console.error('Error invoking OpenAI API:', err.message);
      }
    }

    // 3. Fallback: Built-in intelligent conversational rules engine
    const fallbackReply = generateSmartFallbackResponse(trimmedMsg);
    return res.json({
      success: true,
      reply: fallbackReply,
      provider: 'DriveBot Smart Engine'
    });

  } catch (error) {
    console.error('Server error in /api/chat:', error);
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred.',
      reply: "I apologize, but I'm having trouble processing that right now. Please try again or explore our fleet directly on the website!"
    });
  }
});

// Serve index.html for root
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚗 DriveEase Premium Car Rental Platform is Running!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`🤖 AI Chatbot API Endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🔑 AI Status: ${process.env.GEMINI_API_KEY ? 'Gemini AI Enabled' : (process.env.OPENAI_API_KEY ? 'OpenAI Enabled' : 'Intelligent Built-in Expert Engine Active')}`);
  console.log(`=======================================================`);
});
