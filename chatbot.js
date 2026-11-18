/**
 * DriveEase - AI Chatbot: DriveBot
 * Secure Backend API Integration with Fallback Knowledge Engine
 * Manages Chat UI, Typing Indicators, Quick Chips, History, and In-Chat Actions
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
  const chatbotWindow = document.getElementById('chatbot-window');
  const minimizeChatBtn = document.getElementById('minimize-chat-btn');
  const clearChatBtn = document.getElementById('clear-chat-btn');
  const chatMessages = document.getElementById('chat-messages');
  const chatInputForm = document.getElementById('chat-input-form');
  const chatUserInput = document.getElementById('chat-user-input');
  const chatTypingIndicator = document.getElementById('chat-typing-indicator');
  const chatNotificationBadge = document.getElementById('chat-notification-badge');
  const botProviderLabel = document.getElementById('bot-provider-label');
  const chatSuggestions = document.getElementById('chat-suggestions');

  const iconOpen = chatbotToggleBtn ? chatbotToggleBtn.querySelector('.chatbot-icon-open') : null;
  const iconClose = chatbotToggleBtn ? chatbotToggleBtn.querySelector('.chatbot-icon-close') : null;

  // Session Chat History
  const SESSION_STORAGE_KEY = 'driveease_chat_history';
  let chatHistory = [];
  let isBotTyping = false;

  // ----------------------------------------------------
  // 1. CAR KNOWLEDGE FOR CLIENT-SIDE SMART FALLBACK
  // ----------------------------------------------------
  const KNOWLEDGE_FLEET = [
    { id: 'porsche-911', name: 'Porsche 911 Carrera GTS', rate: 380, category: 'Sports', seats: 2, deposit: 1500, minAge: 25, img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80' },
    { id: 'mercedes-s-class', name: 'Mercedes-Benz S-Class S580', rate: 320, category: 'Luxury', seats: 5, deposit: 1000, minAge: 23, img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80' },
    { id: 'range-rover', name: 'Range Rover Autobiography', rate: 290, category: 'SUV', seats: 5, deposit: 1000, minAge: 23, img: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=400&q=80' },
    { id: 'tesla-model-s', name: 'Tesla Model S Plaid', rate: 220, category: 'Electric', seats: 5, deposit: 800, minAge: 21, img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80' },
    { id: 'bmw-m4', name: 'BMW M4 Competition Coupe', rate: 260, category: 'Sports', seats: 4, deposit: 1000, minAge: 25, img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80' },
    { id: 'lamborghini-urus', name: 'Lamborghini Urus Pearl Capsule', rate: 550, category: 'SUV', seats: 5, deposit: 2000, minAge: 25, img: 'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&w=400&q=80' },
    { id: 'audi-rs7', name: 'Audi RS7 Sportback', rate: 275, category: 'Sedan', seats: 5, deposit: 1000, minAge: 23, img: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=400&q=80' },
    { id: 'mustang-mache', name: 'Ford Mustang Mach-E GT', rate: 150, category: 'Electric', seats: 5, deposit: 500, minAge: 21, img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80' },
    { id: 'bmw-7-series', name: 'BMW 7 Series 760i xDrive', rate: 310, category: 'Luxury', seats: 5, deposit: 1000, minAge: 23, img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=400&q=80' },
    { id: 'cadillac-escalade', name: 'Cadillac Escalade ESV', rate: 280, category: 'SUV', seats: 7, deposit: 1000, minAge: 23, img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80' }
  ];

  // ----------------------------------------------------
  // 2. CHAT STORAGE & INITIAL WELCOME
  // ----------------------------------------------------
  function loadChatHistory() {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        chatHistory = JSON.parse(saved);
      }
    } catch {
      chatHistory = [];
    }

    if (chatHistory.length === 0) {
      // Add initial welcome message
      const welcome = {
        role: 'assistant',
        text: `Hello! I'm **DriveBot**, your AI luxury concierge at DriveEase. 🚗✨\n\nI can help you explore our exotic fleet, compare daily rates, explain rental requirements, check fuel policies, or find the ideal car for your trip.\n\nHow may I assist you today?`,
        time: getCurrentFormattedTime()
      };
      chatHistory.push(welcome);
      saveChatHistory();
    }

    renderAllMessages();
  }

  function saveChatHistory() {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(chatHistory));
    } catch (e) {
      console.warn('SessionStorage quota exceeded', e);
    }
  }

  function getCurrentFormattedTime() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // ----------------------------------------------------
  // 3. UI RENDERING & FORMATTING
  // ----------------------------------------------------
  function renderAllMessages() {
    if (!chatMessages) return;
    chatMessages.innerHTML = '';
    chatHistory.forEach(msg => appendMessageElement(msg, false));
    scrollToBottom();
  }

  function appendMessageElement(msgObj, shouldScroll = true) {
    if (!chatMessages) return;

    const bubble = document.createElement('div');
    const isUser = msgObj.role === 'user';
    bubble.className = `chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}`;

    // Parse Markdown bold and lists cleanly
    const formattedHtml = formatChatMarkdown(msgObj.text);

    bubble.innerHTML = `
      <div class="chat-bubble-text">${formattedHtml}</div>
      <span class="chat-bubble-time">${msgObj.time || getCurrentFormattedTime()}</span>
    `;

    // Check if message references specific cars to attach an interactive card!
    if (!isUser && msgObj.cardCarId) {
      const car = KNOWLEDGE_FLEET.find(c => c.id === msgObj.cardCarId);
      if (car) {
        const miniCard = document.createElement('div');
        miniCard.className = 'in-chat-car-card';
        miniCard.innerHTML = `
          <img src="${car.img}" alt="${car.name}">
          <div class="in-chat-car-info">
            <h5>${car.name}</h5>
            <span>$${car.rate} / day</span>
          </div>
          <button class="in-chat-book-btn" data-car-id="${car.id}">Book Now</button>
        `;

        miniCard.querySelector('.in-chat-book-btn').addEventListener('click', (e) => {
          const carId = e.currentTarget.getAttribute('data-car-id');
          if (window.DriveEase && window.DriveEase.openBookingModalById) {
            window.DriveEase.openBookingModalById(carId);
            toggleChatWindow(false);
          }
        });

        bubble.appendChild(miniCard);
      }
    }

    chatMessages.appendChild(bubble);

    if (shouldScroll) {
      scrollToBottom();
    }
  }

  function formatChatMarkdown(text) {
    if (!text) return '';

    let res = text
      // Bold **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Bullet points
      .replace(/^[•\-\*]\s+(.*)$/gm, '• $1')
      // Newlines to breaks
      .replace(/\n/g, '<br>');

    return res;
  }

  function scrollToBottom() {
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  // ----------------------------------------------------
  // 4. CHATBOT VISIBILITY TOGGLE
  // ----------------------------------------------------
  function toggleChatWindow(forceState) {
    if (!chatbotWindow) return;

    const isOpen = forceState !== undefined ? forceState : !chatbotWindow.classList.contains('open');

    if (isOpen) {
      chatbotWindow.classList.add('open');
      chatbotWindow.setAttribute('aria-hidden', 'false');
      if (iconOpen) iconOpen.classList.add('d-none');
      if (iconClose) iconClose.classList.remove('d-none');
      if (chatNotificationBadge) chatNotificationBadge.classList.add('d-none');
      setTimeout(() => {
        if (chatUserInput) chatUserInput.focus();
        scrollToBottom();
      }, 150);
    } else {
      chatbotWindow.classList.remove('open');
      chatbotWindow.setAttribute('aria-hidden', 'true');
      if (iconOpen) iconOpen.classList.remove('d-none');
      if (iconClose) iconClose.classList.add('d-none');
    }
  }

  if (chatbotToggleBtn) {
    chatbotToggleBtn.addEventListener('click', () => toggleChatWindow());
  }

  if (minimizeChatBtn) {
    minimizeChatBtn.addEventListener('click', () => toggleChatWindow(false));
  }

  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', () => {
      if (confirm('Clear chat history?')) {
        chatHistory = [];
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        loadChatHistory();
      }
    });
  }

  // ----------------------------------------------------
  // 5. SUGGESTION CHIPS INTERACTION
  // ----------------------------------------------------
  if (chatSuggestions) {
    chatSuggestions.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        if (query) {
          sendUserMessage(query);
        }
      });
    });
  }

  // ----------------------------------------------------
  // 6. MESSAGE SENDING & API DISPATCH
  // ----------------------------------------------------
  if (chatInputForm) {
    chatInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatUserInput.value.trim();
      if (!text || isBotTyping) return;
      sendUserMessage(text);
      chatUserInput.value = '';
    });
  }

  async function sendUserMessage(text) {
    if (isBotTyping) return;

    // 1. Append User Message
    const userMsg = {
      role: 'user',
      text: text,
      time: getCurrentFormattedTime()
    };
    chatHistory.push(userMsg);
    saveChatHistory();
    appendMessageElement(userMsg);

    // 2. Show Typing Indicator
    showTyping(true);

    try {
      // 3. Dispatch to secure backend endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatHistory.map(h => ({ role: h.role, text: h.text }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botReply = data.reply || "I'm here to help with your luxury car rental!";
        const provider = data.provider || 'AI Engine';

        if (botProviderLabel) {
          botProviderLabel.textContent = `Connected to ${provider}`;
        }

        // Detect if any car is strongly highlighted to append mini-card
        const matchedCar = findHighlightedCar(botReply);

        setTimeout(() => {
          showTyping(false);
          const botMsg = {
            role: 'assistant',
            text: botReply,
            time: getCurrentFormattedTime(),
            cardCarId: matchedCar ? matchedCar.id : null
          };
          chatHistory.push(botMsg);
          saveChatHistory();
          appendMessageElement(botMsg);
        }, 500);

      } else {
        throw new Error('Non-200 server response');
      }

    } catch (networkErr) {
      console.warn('Backend /api/chat unreachable, using client-side intelligent fallback engine.', networkErr.message);

      if (botProviderLabel) {
        botProviderLabel.textContent = 'DriveBot Built-in Expert Engine (Offline Mode)';
      }

      // 4. Client-side fallback intelligence
      setTimeout(() => {
        showTyping(false);
        const fallbackReply = generateClientSmartResponse(text);
        const matchedCar = findHighlightedCar(fallbackReply);

        const botMsg = {
          role: 'assistant',
          text: fallbackReply,
          time: getCurrentFormattedTime(),
          cardCarId: matchedCar ? matchedCar.id : null
        };
        chatHistory.push(botMsg);
        saveChatHistory();
        appendMessageElement(botMsg);
      }, 700);
    }
  }

  function showTyping(show) {
    isBotTyping = show;
    if (!chatTypingIndicator) return;
    if (show) {
      chatTypingIndicator.classList.remove('d-none');
      scrollToBottom();
    } else {
      chatTypingIndicator.classList.add('d-none');
    }
  }

  function findHighlightedCar(text) {
    const t = text.toLowerCase();
    if (t.includes('porsche 911') || t.includes('carrera gts')) return KNOWLEDGE_FLEET[0];
    if (t.includes('lamborghini') || t.includes('urus')) return KNOWLEDGE_FLEET[5];
    if (t.includes('mercedes') || t.includes('s-class') || t.includes('s580')) return KNOWLEDGE_FLEET[1];
    if (t.includes('tesla') || t.includes('model s') || t.includes('plaid')) return KNOWLEDGE_FLEET[3];
    if (t.includes('range rover')) return KNOWLEDGE_FLEET[2];
    if (t.includes('m4 competition')) return KNOWLEDGE_FLEET[4];
    if (t.includes('audi rs7')) return KNOWLEDGE_FLEET[6];
    if (t.includes('mustang mach-e')) return KNOWLEDGE_FLEET[7];
    if (t.includes('cadillac escalade')) return KNOWLEDGE_FLEET[9];
    return null;
  }

  // ----------------------------------------------------
  // 7. CLIENT-SIDE FALLBACK KNOWLEDGE ENGINE
  // ----------------------------------------------------
  function generateClientSmartResponse(query) {
    const q = query.toLowerCase().trim();

    // Greeting
    if (/\b(hi|hello|hey|good morning|good evening|howdy)\b/i.test(q)) {
      return `Hello! Welcome to **DriveEase Concierge**. 🚗✨\n\nI can assist you with:\n• Browsing our supercar & luxury fleet\n• Checking rental rates & active promo codes\n• Explaining age, license & deposit policies\n• Scheduling airport curbside pickup\n\nWhat kind of vehicle are you looking to drive?`;
    }

    // Specific Cars
    if (q.includes('porsche') || q.includes('911')) {
      return `🏁 **Porsche 911 Carrera GTS**\n\n• **Daily Rate:** $380/day\n• **Performance:** 473 HP, 0-60 in 3.2s, Top speed 193 mph\n• **Seating:** 2 Passengers\n• **Rental Rules:** Driver must be 25+, $1,500 refundable security deposit.\n\nWould you like to book this Porsche for your upcoming trip?`;
    }

    if (q.includes('lamborghini') || q.includes('urus')) {
      return `🐂 **Lamborghini Urus Pearl Capsule**\n\n• **Daily Rate:** $550/day\n• **Performance:** 641 HP Twin-Turbo V8 AWD, 0-60 in 3.1s\n• **Seating:** 5 Passengers with generous luxury cargo space\n• **Rental Rules:** Driver must be 25+, $2,000 security deposit hold.\n\nThe world's ultimate exotic performance SUV!`;
    }

    if (q.includes('mercedes') || q.includes('s-class') || q.includes('s580')) {
      return `⭐ **Mercedes-Benz S-Class S580**\n\n• **Daily Rate:** $320/day\n• **Features:** Executive Rear Seating, Burmester 3D Sound, Active Massage Seats, Airmatic Suspension\n• **Rental Rules:** Age 23+, $1,000 security deposit.\n\nFlawless executive comfort for business or high-end travel.`;
    }

    if (q.includes('tesla') || q.includes('model s') || q.includes('plaid')) {
      return `⚡ **Tesla Model S Plaid**\n\n• **Daily Rate:** $220/day\n• **Power:** 1,020 HP (0-60 mph in a blistering 1.99s!)\n• **Range:** 396 miles per full charge\n• **Highlights:** Full Self-Driving hardware, Yoke wheel, unlimited Tesla Supercharging compatibility!`;
    }

    if (q.includes('range rover')) {
      return `🏔️ **Range Rover Autobiography**\n\n• **Daily Rate:** $290/day\n• **Seating:** 5 Passengers with Meridian Signature 35-Speaker Audio\n• **Highlights:** All-Terrain Response 2 AWD, Panoramic Roof, Deployable Steps.\n• **Ideal For:** Mountain getaways, luxury family vacations, and VIP road trips.`;
    }

    if (q.includes('escalade') || q.includes('cadillac') || q.includes('7 seat') || q.includes('large group')) {
      return `👑 **Cadillac Escalade ESV Sport (7-Passenger)**\n\n• **Daily Rate:** $280/day\n• **Seating:** 7 full-size adults + huge luggage capacity\n• **Highlights:** Super Cruise hands-free driving, 38" Curved OLED Display, AKG Studio Reference Audio.\n• **Perfect For:** Executive groups and family luxury travel.`;
    }

    // Recommendation
    if (q.includes('recommend') || q.includes('suggest') || q.includes('choose') || q.includes('which car')) {
      return `Here are our top recommendations tailored by trip type: 🎯\n\n• **For Supercar Thrills:** Porsche 911 Carrera GTS ($380/day) or BMW M4 Competition ($260/day)\n• **For Executive Prestige:** Mercedes-Benz S-Class ($320/day) or BMW 7 Series ($310/day)\n• **For VIP Family / Group:** Cadillac Escalade 7-Seater ($280/day) or Range Rover ($290/day)\n• **For Electric Innovation:** Tesla Model S Plaid ($220/day)\n• **Best Value Crossover:** Ford Mustang Mach-E GT ($150/day)\n\nWhich of these best suits your journey?`;
    }

    // Pricing & Discounts
    if (q.includes('price') || q.includes('rate') || q.includes('cost') || q.includes('cheap') || q.includes('how much')) {
      return `💰 **DriveEase Daily Rates Overview**:\n\n• Ford Mustang Mach-E: **$150/day**\n• Tesla Model S Plaid: **$220/day**\n• BMW M4 Competition: **$260/day**\n• Audi RS7 Sportback: **$275/day**\n• Cadillac Escalade ESV: **$280/day**\n• Range Rover Autobiography: **$290/day**\n• BMW 760i xDrive: **$310/day**\n• Mercedes-Benz S-Class: **$320/day**\n• Porsche 911 Carrera GTS: **$380/day**\n• Lamborghini Urus: **$550/day**\n\n🎁 **Active Discounts:** Use promo code **WELCOME10** for 10% off your booking, or **WEEKEND20** for 20% off rentals of 3+ days!`;
    }

    // Promo Codes
    if (q.includes('promo') || q.includes('discount') || q.includes('coupon') || q.includes('code')) {
      return `🎁 **Exclusive Active Promo Codes**:\n\n1. **WELCOME10** — Get **10% OFF** your entire rental (valid for all first-time renters).\n2. **WEEKEND20** — Get **20% OFF** when reserving 3 days or more.\n\n*Apply these codes during checkout in the Booking Form for instant savings!*`;
    }

    // Requirements & Age
    if (q.includes('age') || q.includes('license') || q.includes('requirement') || q.includes('deposit') || q.includes('rules')) {
      return `📋 **Rental Requirements & Policies**:\n\n1. **Age Requirement:** 21+ for executive sedans and electric vehicles. 25+ for supercars (Porsche 911, Lamborghini Urus, BMW M4).\n2. **Valid Driver's License:** Must be active and held for at least 1 year. Passports required for international drivers.\n3. **Security Deposit:** A refundable deposit ($500 to $2,000 depending on vehicle) is held on a credit card at pickup and released upon return.\n4. **Cancellation:** 100% full refund if cancelled at least 24 hours prior to scheduled pickup.`;
    }

    // Locations & Airport
    if (q.includes('location') || q.includes('airport') || q.includes('pickup') || q.includes('dropoff') || q.includes('delivery')) {
      return `📍 **Pickup & Delivery Options**:\n\n• **Major Airports:** Curbside delivery at JFK (New York), LAX (Los Angeles), MIA (Miami), LAS (Las Vegas), ORD (Chicago), SFO (San Francisco).\n• **Doorstep White-Glove Delivery:** Delivered directly to your home, private jet terminal, or hotel lobby within 20 miles.\n• **Flexible Returns:** Return to the same hub or request a one-way transfer.`;
    }

    // Fuel & EV
    if (q.includes('fuel') || q.includes('gas') || q.includes('petrol') || q.includes('charge')) {
      return `⛽ **Fuel & EV Charging Policy**:\n\n• **Full-to-Full:** Petrol and hybrid vehicles are supplied full and should be returned full.\n• **Electric Vehicles:** Provided with at least 80% charge. Return with 70%+ without any penalty fees.\n• **Premium Fuel:** All high-performance engines require 91+ Octane unleaded.`;
    }

    // Booking procedures
    if (q.includes('how to book') || q.includes('book') || q.includes('procedure') || q.includes('process')) {
      return `⚡ **Booking is simple & takes only 60 seconds**:\n\n1. Select your favorite car from our fleet.\n2. Click **"Book Now"**.\n3. Choose pickup and return dates & location.\n4. Select optional insurance or GPS add-ons.\n5. Apply promo code **"WELCOME10"** and confirm!\n\nYou'll receive an instant confirmation receipt and reference ID.`;
    }

    // General fallback
    return `Thank you for asking about **"${query}"**! 🚗\n\nDriveEase offers the nation's premier selection of luxury, exotic, and electric vehicles with transparent pricing and 24/7 concierge assistance.\n\nFeel free to ask me:\n• "What luxury cars are available?"\n• "How much is the Porsche 911?"\n• "What are the rental requirements?"\n• "Do you offer airport delivery?"`;
  }

  // ----------------------------------------------------
  // INITIALIZE CHATBOT
  // ----------------------------------------------------
  loadChatHistory();
});
