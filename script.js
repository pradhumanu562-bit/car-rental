/**
 * DriveEase - Premium Car Rental Platform
 * Main Frontend Logic (Fleet Rendering, Search, Booking, LocalStorage, Modals, Auth)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------------------------------
  // 1. CAR FLEET DATABASE (At least 10 Sample Luxury Cars)
  // ----------------------------------------------------
  const CARS = [
    {
      id: 'porsche-911',
      name: 'Porsche 911 Carrera GTS',
      year: 2024,
      category: 'Sports',
      price: 380,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      rating: 4.98,
      reviewsCount: 142,
      transmission: 'PDK Automatic',
      fuel: 'Petrol (Twin-Turbo)',
      seats: 2,
      hp: '473 HP',
      zeroToSixty: '3.2s',
      topSpeed: '193 mph',
      deposit: 1500,
      minAge: 25,
      features: [
        'Sport Chrono Package',
        'Bose High-End Surround Sound',
        'Porsche Active Suspension (PASM)',
        'Apple CarPlay & Android Auto',
        'Sport Exhaust System with Black Tailpipes',
        'Heated Sport Seats Plus'
      ],
      description: 'The definitive benchmark for rear-engine sports cars. Raw performance blended with sublime daily comfort.'
    },
    {
      id: 'mercedes-s-class',
      name: 'Mercedes-Benz S-Class S580',
      year: 2024,
      category: 'Luxury',
      price: 320,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      rating: 4.96,
      reviewsCount: 189,
      transmission: '9-Speed Automatic',
      fuel: 'Mild Hybrid V8',
      seats: 5,
      hp: '496 HP',
      zeroToSixty: '4.4s',
      topSpeed: '155 mph',
      deposit: 1000,
      minAge: 23,
      features: [
        'Executive Rear Seating Package',
        'Burmester 3D High-End Sound',
        'Active Multicontour Massage Seats',
        'Airmatic Air Suspension',
        'Augmented Reality Head-Up Display',
        '64-Color Ambient Interior Lighting'
      ],
      description: 'The pinnacle of automotive luxury and tranquility. Engineered for executives who demand flawless prestige.'
    },
    {
      id: 'range-rover',
      name: 'Range Rover Autobiography',
      year: 2024,
      category: 'SUV',
      price: 290,
      image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      rating: 4.92,
      reviewsCount: 110,
      transmission: '8-Speed Automatic AWD',
      fuel: 'Petrol (4.4L V8)',
      seats: 5,
      hp: '523 HP',
      zeroToSixty: '4.4s',
      topSpeed: '155 mph',
      deposit: 1000,
      minAge: 23,
      features: [
        'All-Terrain Response 2 AWD',
        'Panoramic Sliding Glass Roof',
        'Power Deployable Side Steps',
        'Meridian Signature 35-Speaker Audio',
        'Four-Zone Executive Climate Control',
        'ClearSight Ground View Camera'
      ],
      description: 'Commanding road presence matched with peerless British refinement. Effortless anywhere in all weather conditions.'
    },
    {
      id: 'tesla-model-s',
      name: 'Tesla Model S Plaid',
      year: 2024,
      category: 'Electric',
      price: 220,
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      rating: 4.95,
      reviewsCount: 224,
      transmission: 'Direct Drive Tri-Motor AWD',
      fuel: '100% Electric (396 mi range)',
      seats: 5,
      hp: '1,020 HP',
      zeroToSixty: '1.99s',
      topSpeed: '200 mph',
      deposit: 800,
      minAge: 21,
      features: [
        'Tri-Motor All-Wheel Drive',
        'Full Self-Driving Capability Ready',
        'Yoke Steering Wheel with 17" Cinematic Touchscreen',
        'Tesla Supercharging Network Access',
        'Active Noise Cancellation Cabin',
        'Wireless Multi-Device Fast Charging'
      ],
      description: 'Unmatched electric acceleration. The fastest-accelerating production sedan on earth with futuristic tech.'
    },
    {
      id: 'bmw-m4',
      name: 'BMW M4 Competition Coupe',
      year: 2024,
      category: 'Sports',
      price: 260,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      rating: 4.94,
      reviewsCount: 95,
      transmission: '8-Speed M Steptronic',
      fuel: 'Petrol (3.0L M TwinPower)',
      seats: 4,
      hp: '503 HP',
      zeroToSixty: '3.4s',
      topSpeed: '180 mph',
      deposit: 1000,
      minAge: 25,
      features: [
        'M Carbon Fiber Bucket Seats',
        'M Drift Analyzer & Track Mode',
        'Adaptive M Suspension',
        'M Head-Up Display',
        'Harman Kardon Surround Sound',
        'Carbon Fiber Exterior Package'
      ],
      description: 'Born for adrenaline. Aggressive styling, razor-sharp track handling, and instantaneous twin-turbo punch.'
    },
    {
      id: 'lamborghini-urus',
      name: 'Lamborghini Urus Pearl Capsule',
      year: 2024,
      category: 'SUV',
      price: 550,
      image: 'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&w=1200&q=80',
      rating: 4.99,
      reviewsCount: 167,
      transmission: '8-Speed Automatic AWD',
      fuel: 'Petrol (4.0L Twin-Turbo V8)',
      seats: 5,
      hp: '641 HP',
      zeroToSixty: '3.1s',
      topSpeed: '190 mph',
      deposit: 2000,
      minAge: 25,
      features: [
        'Carbon Ceramic Brakes',
        'Bang & Olufsen 3D Advanced Audio',
        'Tamburo Driving Dynamics Selector (Corsa/Neve)',
        'Alcantara Interior with Orange Stitching',
        'Sport Exhaust with Quad Matte Finish',
        '23-Inch Diamond Cut Wheels'
      ],
      description: 'The world’s premier Super Sports Utility Vehicle. Supercar DNA infused into high-riding luxury utility.'
    },
    {
      id: 'audi-rs7',
      name: 'Audi RS7 Sportback Performance',
      year: 2024,
      category: 'Sedan',
      price: 275,
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
      rating: 4.93,
      reviewsCount: 88,
      transmission: '8-Speed Tiptronic Quattro',
      fuel: 'Petrol (4.0L Twin-Turbo V8)',
      seats: 5,
      hp: '621 HP',
      zeroToSixty: '3.3s',
      topSpeed: '174 mph',
      deposit: 1000,
      minAge: 23,
      features: [
        'RS Dynamic Package Plus',
        'Valcona Leather Sport Seats',
        'Bang & Olufsen 19-Speaker 3D Audio',
        'HD Matrix-Design LED with Audi Laser Light',
        'Dynamic All-Wheel Steering',
        'Audi Virtual Cockpit Plus RS'
      ],
      description: 'Sleek grand-touring fastback profile coupled with devastating Quattro performance and understated elegance.'
    },
    {
      id: 'mustang-mache',
      name: 'Ford Mustang Mach-E GT',
      year: 2024,
      category: 'Electric',
      price: 150,
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
      rating: 4.88,
      reviewsCount: 130,
      transmission: 'Single-Speed AWD',
      fuel: '100% Electric (270 mi range)',
      seats: 5,
      hp: '480 HP',
      zeroToSixty: '3.5s',
      topSpeed: '124 mph',
      deposit: 500,
      minAge: 21,
      features: [
        'MagneRide Damping System',
        'Brembo Performance Brakes',
        'Ford Co-Pilot360 Active 2.0 (Hands-Free BlueCruise)',
        '15.5-Inch Center Touchscreen with SYNC 4A',
        'B&O Sound System by Bang & Olufsen',
        'Panoramic Fixed-Glass Roof'
      ],
      description: 'All-electric performance crossover carrying iconic Mustang swagger. Fast, efficient, and comfortable for five.'
    },
    {
      id: 'bmw-7-series',
      name: 'BMW 7 Series 760i xDrive',
      year: 2024,
      category: 'Luxury',
      price: 310,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      rating: 4.95,
      reviewsCount: 79,
      transmission: '8-Speed Steptronic Sport',
      fuel: 'Twin-Turbo V8 Mild Hybrid',
      seats: 5,
      hp: '536 HP',
      zeroToSixty: '4.1s',
      topSpeed: '155 mph',
      deposit: 1000,
      minAge: 23,
      features: [
        '31.3-Inch 8K Theater Rear Lounge Screen',
        'Sky Lounge Panoramic LED Roof',
        'Automatic Power Doors',
        'Bowers & Wilkins Diamond Surround Sound',
        'BMW Curved Display with Operating System 8.5',
        'Active Roll Stabilization'
      ],
      description: 'First-class luxury travel redefined with an ultra-wide drop-down 8K rear theater screen and opulent lounge seats.'
    },
    {
      id: 'cadillac-escalade',
      name: 'Cadillac Escalade ESV Sport',
      year: 2024,
      category: 'SUV',
      price: 280,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      rating: 4.91,
      reviewsCount: 154,
      transmission: '10-Speed Automatic 4WD',
      fuel: 'Petrol (6.2L V8)',
      seats: 7,
      hp: '420 HP',
      zeroToSixty: '5.9s',
      topSpeed: '130 mph',
      deposit: 1000,
      minAge: 23,
      features: [
        '7 Full-Size Adult Seating Capacity',
        'Super Cruise Hands-Free Highway Driving',
        'Curved 38-Inch Total OLED Display',
        'AKG Studio Reference 36-Speaker Audio',
        'Console Refrigerator with Freezer Mode',
        'Magnetic Ride Control with Air Suspension'
      ],
      description: 'The standard of luxury 7-passenger utility. Endless cabin room, executive road presence, and state-of-the-art tech.'
    }
  ];

  // ----------------------------------------------------
  // 2. STATE MANAGEMENT & LOCAL STORAGE
  // ----------------------------------------------------
  let activeFilterCategory = 'all';
  let activeSearchQuery = '';
  let activeSortOption = 'featured';
  let selectedCarForBooking = CARS[0];
  let activePromo = null;

  // LocalStorage keys
  const STORAGE_KEY_BOOKINGS = 'driveease_bookings';
  const STORAGE_KEY_USER = 'driveease_user';

  // Load bookings from LocalStorage
  function getStoredBookings() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading bookings from LocalStorage', e);
      return [];
    }
  }

  function saveStoredBookings(bookings) {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
      updateBookingsBadge();
    } catch (e) {
      console.error('Error writing bookings to LocalStorage', e);
    }
  }

  function updateBookingsBadge() {
    const badge = document.getElementById('booking-badge-count');
    const bookings = getStoredBookings();
    if (badge) {
      if (bookings.length > 0) {
        badge.textContent = bookings.length;
        badge.classList.remove('d-none');
      } else {
        badge.classList.add('d-none');
      }
    }
  }

  // ----------------------------------------------------
  // 3. TOAST NOTIFICATIONS SYSTEM
  // ----------------------------------------------------
  function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check text-orange';
    if (type === 'error') icon = 'fa-triangle-exclamation';
    if (type === 'warning') icon = 'fa-circle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  }

  // ----------------------------------------------------
  // 4. FLEET RENDERING & FILTERING
  // ----------------------------------------------------
  const carsGrid = document.getElementById('cars-grid');
  const noCarsFound = document.getElementById('no-cars-found');
  const carTextSearch = document.getElementById('car-text-search');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const carSortSelect = document.getElementById('car-sort-select');
  const categoryFilters = document.getElementById('category-filters');

  function renderCars() {
    if (!carsGrid) return;

    let filtered = CARS.filter(car => {
      // Category match
      const matchCat = activeFilterCategory === 'all' || 
                       car.category.toLowerCase() === activeFilterCategory.toLowerCase() ||
                       (activeFilterCategory === 'Sedan' && (car.category.includes('Sedan') || car.id.includes('audi') || car.id.includes('mercedes') || car.id.includes('bmw-7')));

      // Search text match
      const query = activeSearchQuery.toLowerCase().trim();
      const matchSearch = query === '' ||
                          car.name.toLowerCase().includes(query) ||
                          car.category.toLowerCase().includes(query) ||
                          car.fuel.toLowerCase().includes(query) ||
                          car.features.some(f => f.toLowerCase().includes(query));

      return matchCat && matchSearch;
    });

    // Sort cars
    if (activeSortOption === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeSortOption === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (activeSortOption === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (activeSortOption === 'speed') {
      filtered.sort((a, b) => parseFloat(a.zeroToSixty) - parseFloat(b.zeroToSixty));
    }

    // Render HTML
    carsGrid.innerHTML = '';

    if (filtered.length === 0) {
      if (noCarsFound) noCarsFound.classList.remove('d-none');
      return;
    } else {
      if (noCarsFound) noCarsFound.classList.add('d-none');
    }

    filtered.forEach(car => {
      const card = document.createElement('div');
      card.className = 'car-card';
      card.setAttribute('data-id', car.id);

      card.innerHTML = `
        <div class="car-card-img-box">
          <img src="${car.image}" alt="${car.name}" class="car-card-img" loading="lazy">
          <div class="car-card-badges">
            <span class="badge-category">${car.category}</span>
            <span class="badge-rating"><i class="fa-solid fa-star text-orange"></i> ${car.rating} (${car.reviewsCount})</span>
          </div>
        </div>

        <div class="car-card-body">
          <div class="car-card-header">
            <h3 class="car-name">${car.name}</h3>
            <span class="car-subtitle">${car.year} Model • ${car.hp}</span>
          </div>

          <div class="car-specs-grid">
            <div class="spec-item" title="Transmission">
              <i class="fa-solid fa-gears"></i>
              <span>${car.transmission.split(' ')[0]}</span>
            </div>
            <div class="spec-item" title="Fuel / Power">
              <i class="fa-solid fa-gas-pump"></i>
              <span>${car.fuel.split(' ')[0]}</span>
            </div>
            <div class="spec-item" title="Seating Capacity">
              <i class="fa-solid fa-user-group"></i>
              <span>${car.seats} Seats</span>
            </div>
            <div class="spec-item" title="0-60 mph acceleration">
              <i class="fa-solid fa-stopwatch"></i>
              <span>0-60: ${car.zeroToSixty}</span>
            </div>
          </div>

          <div class="car-card-footer">
            <div class="car-price-box">
              <div class="car-price-amount">$${car.price} <span>/ day</span></div>
              <small class="text-muted" style="font-size:0.7rem;">Taxes & insurance options extra</small>
            </div>
            <div class="car-card-btns">
              <button class="btn btn-outline-sm btn-view-details" data-id="${car.id}">Details</button>
              <button class="btn btn-primary-sm btn-card-book" data-id="${car.id}">
                <span>Book Now</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      carsGrid.appendChild(card);
    });

    // Attach listeners to newly created buttons
    document.querySelectorAll('.btn-view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const found = CARS.find(c => c.id === id);
        if (found) openCarDetailsModal(found);
      });
    });

    document.querySelectorAll('.btn-card-book').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const found = CARS.find(c => c.id === id);
        if (found) openBookingModal(found);
      });
    });
  }

  // Category filter click
  if (categoryFilters) {
    categoryFilters.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        categoryFilters.querySelectorAll('.filter-pill').forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');
        activeFilterCategory = pill.getAttribute('data-category');
        renderCars();
      });
    });
  }

  // Text search input
  if (carTextSearch) {
    carTextSearch.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value;
      if (clearSearchBtn) {
        if (activeSearchQuery.length > 0) {
          clearSearchBtn.classList.remove('d-none');
        } else {
          clearSearchBtn.classList.add('d-none');
        }
      }
      renderCars();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      carTextSearch.value = '';
      activeSearchQuery = '';
      clearSearchBtn.classList.add('d-none');
      renderCars();
    });
  }

  // Sort dropdown change
  if (carSortSelect) {
    carSortSelect.addEventListener('change', (e) => {
      activeSortOption = e.target.value;
      renderCars();
    });
  }

  // Reset filters button in empty state
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      activeFilterCategory = 'all';
      activeSearchQuery = '';
      activeSortOption = 'featured';
      if (carTextSearch) carTextSearch.value = '';
      if (clearSearchBtn) clearSearchBtn.classList.add('d-none');
      if (carSortSelect) carSortSelect.value = 'featured';
      if (categoryFilters) {
        categoryFilters.querySelectorAll('.filter-pill').forEach(p => {
          p.classList.remove('active');
          if (p.getAttribute('data-category') === 'all') p.classList.add('active');
        });
      }
      renderCars();
    });
  }

  // Footer category filters links
  document.querySelectorAll('a[data-filter]').forEach(link => {
    link.addEventListener('click', (e) => {
      const filter = e.currentTarget.getAttribute('data-filter');
      activeFilterCategory = filter;
      if (categoryFilters) {
        categoryFilters.querySelectorAll('.filter-pill').forEach(p => {
          p.classList.remove('active');
          if (p.getAttribute('data-category') === filter) p.classList.add('active');
        });
      }
      renderCars();
    });
  });

  // ----------------------------------------------------
  // 5. HERO SEARCH FORM INTERACTION
  // ----------------------------------------------------
  const heroSearchForm = document.getElementById('hero-search-form');
  const pickupDateInput = document.getElementById('pickup-date');
  const returnDateInput = document.getElementById('return-date');
  const searchCategorySelect = document.getElementById('search-category');

  // Pre-fill sensible default dates (Tomorrow -> 3 days later)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const returnDefault = new Date(tomorrow);
  returnDefault.setDate(tomorrow.getDate() + 3);

  const formatDateYMD = (d) => d.toISOString().split('T')[0];

  if (pickupDateInput) {
    pickupDateInput.min = formatDateYMD(today);
    pickupDateInput.value = formatDateYMD(tomorrow);
  }
  if (returnDateInput) {
    returnDateInput.min = formatDateYMD(tomorrow);
    returnDateInput.value = formatDateYMD(returnDefault);
  }

  if (pickupDateInput && returnDateInput) {
    pickupDateInput.addEventListener('change', () => {
      const pDate = new Date(pickupDateInput.value);
      pDate.setDate(pDate.getDate() + 1);
      returnDateInput.min = formatDateYMD(pDate);
      if (new Date(returnDateInput.value) <= new Date(pickupDateInput.value)) {
        returnDateInput.value = formatDateYMD(pDate);
      }
    });
  }

  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const location = document.getElementById('pickup-location').value;
      if (!location) {
        showToast('Please select a pickup location first!', 'warning');
        return;
      }

      const selectedCategory = searchCategorySelect.value;
      if (selectedCategory && selectedCategory !== 'all') {
        activeFilterCategory = selectedCategory;
        if (categoryFilters) {
          categoryFilters.querySelectorAll('.filter-pill').forEach(p => {
            p.classList.remove('active');
            if (p.getAttribute('data-category').toLowerCase() === selectedCategory.toLowerCase()) {
              p.classList.add('active');
            }
          });
        }
      }

      renderCars();

      // Scroll to fleet
      const carsSection = document.getElementById('cars');
      if (carsSection) {
        carsSection.scrollIntoView({ behavior: 'smooth' });
        showToast(`Showing available cars for ${location}!`, 'success');
      }
    });
  }

  // Hero Search Widget Tabs
  document.querySelectorAll('.search-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const type = tab.getAttribute('data-type');
      if (type === 'delivery') {
        document.getElementById('pickup-location').value = 'Custom Doorstep Address';
        showToast('Doorstep delivery selected! We deliver directly to your door or hotel.', 'info');
      }
    });
  });

  // Hero How It Works button
  const heroHowBtn = document.getElementById('hero-how-it-works-btn');
  if (heroHowBtn) {
    heroHowBtn.addEventListener('click', () => {
      const section = document.getElementById('how-it-works');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ----------------------------------------------------
  // 6. CAR DETAILS MODAL LOGIC
  // ----------------------------------------------------
  const carDetailsModal = document.getElementById('car-details-modal');
  const modalProceedBookingBtn = document.getElementById('modal-proceed-booking-btn');

  function openCarDetailsModal(car) {
    selectedCarForBooking = car;

    document.getElementById('modal-car-category').textContent = car.category;
    document.getElementById('modal-car-title').textContent = `${car.name} (${car.year})`;
    document.getElementById('modal-car-image').src = car.image;
    document.getElementById('modal-car-image').alt = car.name;
    document.getElementById('modal-car-price').textContent = `$${car.price}`;
    document.getElementById('modal-min-age').textContent = `${car.minAge}+`;
    document.getElementById('modal-deposit').textContent = `$${car.deposit.toLocaleString()}`;

    // Specs Badges
    const specsBadgesContainer = document.getElementById('modal-specs-badges');
    specsBadgesContainer.innerHTML = `
      <div class="spec-cell"><span class="spec-cell-label">Horsepower</span><span class="spec-cell-val">${car.hp}</span></div>
      <div class="spec-cell"><span class="spec-cell-label">0-60 mph</span><span class="spec-cell-val">${car.zeroToSixty}</span></div>
    `;

    // Specs Table
    const specsTable = document.getElementById('modal-specs-table');
    specsTable.innerHTML = `
      <div class="spec-cell"><span class="spec-cell-label">Transmission</span><span class="spec-cell-val">${car.transmission}</span></div>
      <div class="spec-cell"><span class="spec-cell-label">Fuel / Powertrain</span><span class="spec-cell-val">${car.fuel}</span></div>
      <div class="spec-cell"><span class="spec-cell-label">Seating Capacity</span><span class="spec-cell-val">${car.seats} Adult Passengers</span></div>
      <div class="spec-cell"><span class="spec-cell-label">Top Speed</span><span class="spec-cell-val">${car.topSpeed}</span></div>
    `;

    // Features Checklist
    const featuresList = document.getElementById('modal-features-list');
    featuresList.innerHTML = car.features.map(f => `
      <div class="feature-check-item">
        <i class="fa-solid fa-circle-check"></i>
        <span>${f}</span>
      </div>
    `).join('');

    openModal(carDetailsModal);
  }

  if (modalProceedBookingBtn) {
    modalProceedBookingBtn.addEventListener('click', () => {
      closeModal(carDetailsModal);
      setTimeout(() => {
        openBookingModal(selectedCarForBooking);
      }, 250);
    });
  }

  // ----------------------------------------------------
  // 7. CAR BOOKING SYSTEM MODAL LOGIC
  // ----------------------------------------------------
  const bookingModal = document.getElementById('booking-modal');
  const bookPickupDate = document.getElementById('book-pickup-date');
  const bookReturnDate = document.getElementById('book-return-date');
  const bookPickupLoc = document.getElementById('book-pickup-location');
  const addonInsurance = document.getElementById('addon-insurance');
  const addonRoadside = document.getElementById('addon-roadside');
  const addonDriver = document.getElementById('addon-driver');
  const addonGps = document.getElementById('addon-gps');
  const promoInput = document.getElementById('promo-input');
  const applyPromoBtn = document.getElementById('apply-promo-btn');
  const promoMessage = document.getElementById('promo-message');
  const confirmBookingBtn = document.getElementById('confirm-booking-btn');

  function calculateRentalDays() {
    if (!bookPickupDate.value || !bookReturnDate.value) return 1;
    const start = new Date(bookPickupDate.value);
    const end = new Date(bookReturnDate.value);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }

  function recalculateBookingSummary() {
    if (!selectedCarForBooking) return;

    const days = calculateRentalDays();
    const dailyPrice = selectedCarForBooking.price;
    const baseTotal = dailyPrice * days;

    // Addons
    let addonsDaily = 0;
    if (addonInsurance && addonInsurance.checked) addonsDaily += parseFloat(addonInsurance.getAttribute('data-price') || 25);
    if (addonRoadside && addonRoadside.checked) addonsDaily += parseFloat(addonRoadside.getAttribute('data-price') || 10);
    if (addonDriver && addonDriver.checked) addonsDaily += parseFloat(addonDriver.getAttribute('data-price') || 15);
    if (addonGps && addonGps.checked) addonsDaily += parseFloat(addonGps.getAttribute('data-price') || 10);

    const addonsTotal = addonsDaily * days;
    const subtotal = baseTotal + addonsTotal;
    const taxes = subtotal * 0.10; // 10% tax

    let discount = 0;
    if (activePromo) {
      discount = (subtotal + taxes) * activePromo.rate;
    }

    const grandTotal = Math.max(0, subtotal + taxes - discount);

    // Update UI elements
    document.getElementById('summary-days-count').textContent = `${days} Day${days > 1 ? 's' : ''}`;
    document.getElementById('calc-days-multiplier').textContent = `${days} day${days > 1 ? 's' : ''}`;
    document.getElementById('summary-pickup-loc').textContent = bookPickupLoc.value;
    document.getElementById('calc-base-total').textContent = `$${baseTotal.toFixed(2)}`;
    document.getElementById('calc-addons-total').textContent = `$${addonsTotal.toFixed(2)}`;
    document.getElementById('calc-taxes-total').textContent = `$${taxes.toFixed(2)}`;

    const discountRow = document.getElementById('calc-discount-row');
    if (activePromo && discount > 0) {
      discountRow.classList.remove('d-none');
      document.getElementById('discount-pct-label').textContent = `${activePromo.rate * 100}% (${activePromo.code})`;
      document.getElementById('calc-discount-val').textContent = `-$${discount.toFixed(2)}`;
    } else {
      discountRow.classList.add('d-none');
    }

    document.getElementById('calc-grand-total').textContent = `$${grandTotal.toFixed(2)}`;
  }

  function openBookingModal(car) {
    selectedCarForBooking = car;
    activePromo = null;
    if (promoInput) promoInput.value = '';
    if (promoMessage) promoMessage.className = 'promo-msg d-none';

    // Populate car summary details
    document.getElementById('summary-car-img').src = car.image;
    document.getElementById('summary-car-img').alt = car.name;
    document.getElementById('summary-car-name').textContent = car.name;
    document.getElementById('summary-car-category').textContent = car.category;
    document.getElementById('summary-daily-price').textContent = `$${car.price}`;
    document.getElementById('summary-deposit-amt').textContent = `$${car.deposit.toLocaleString()}`;

    // Synchronize pickup/return dates from hero if set, or set defaults
    if (pickupDateInput && pickupDateInput.value) {
      bookPickupDate.value = pickupDateInput.value;
    } else {
      bookPickupDate.value = formatDateYMD(tomorrow);
    }

    if (returnDateInput && returnDateInput.value) {
      bookReturnDate.value = returnDateInput.value;
    } else {
      bookReturnDate.value = formatDateYMD(returnDefault);
    }

    // Set min dates
    bookPickupDate.min = formatDateYMD(today);
    bookReturnDate.min = bookPickupDate.value;

    // Check logged in user to auto fill
    const loggedUser = getStoredUser();
    if (loggedUser) {
      document.getElementById('book-cust-name').value = loggedUser.name || '';
      document.getElementById('book-cust-email').value = loggedUser.email || '';
    }

    recalculateBookingSummary();
    openModal(bookingModal);
  }

  // Date and Addon listeners
  [bookPickupDate, bookReturnDate, bookPickupLoc, addonInsurance, addonRoadside, addonDriver, addonGps].forEach(el => {
    if (el) {
      el.addEventListener('change', recalculateBookingSummary);
    }
  });

  // Promo Code Validation
  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!code) {
        showPromoMsg('Please enter a coupon code.', 'error');
        return;
      }

      const days = calculateRentalDays();

      if (code === 'WELCOME10') {
        activePromo = { code: 'WELCOME10', rate: 0.10 };
        showPromoMsg('Success! 10% discount applied.', 'success');
        recalculateBookingSummary();
        showToast('Promo code WELCOME10 applied! -10%', 'success');
      } else if (code === 'WEEKEND20') {
        if (days >= 3) {
          activePromo = { code: 'WEEKEND20', rate: 0.20 };
          showPromoMsg('Success! 20% discount applied for 3+ days trip.', 'success');
          recalculateBookingSummary();
          showToast('Promo code WEEKEND20 applied! -20%', 'success');
        } else {
          showPromoMsg('Code WEEKEND20 requires a booking of at least 3 days.', 'error');
        }
      } else {
        activePromo = null;
        showPromoMsg('Invalid promo code. Try WELCOME10 or WEEKEND20', 'error');
        recalculateBookingSummary();
      }
    });
  }

  function showPromoMsg(text, type) {
    if (!promoMessage) return;
    promoMessage.textContent = text;
    promoMessage.className = `promo-msg ${type}`;
    promoMessage.classList.remove('d-none');
  }

  // Confirm Booking Submission
  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', () => {
      const custName = document.getElementById('book-cust-name').value.trim();
      const custEmail = document.getElementById('book-cust-email').value.trim();
      const custPhone = document.getElementById('book-cust-phone').value.trim();
      const custLicense = document.getElementById('book-cust-license').value.trim();
      const pickupLoc = bookPickupLoc.value;
      const pickupDate = bookPickupDate.value;
      const returnDate = bookReturnDate.value;
      const specialReq = document.getElementById('book-special-requests').value.trim();

      // Basic validations
      if (!custName) {
        showToast('Please enter your full legal name as on license.', 'warning');
        document.getElementById('book-cust-name').focus();
        return;
      }
      if (!custEmail || !custEmail.includes('@')) {
        showToast('Please enter a valid email address.', 'warning');
        document.getElementById('book-cust-email').focus();
        return;
      }
      if (!custPhone) {
        showToast('Please enter your phone number.', 'warning');
        document.getElementById('book-cust-phone').focus();
        return;
      }
      if (!custLicense) {
        showToast('Please enter your driver\'s license number.', 'warning');
        document.getElementById('book-cust-license').focus();
        return;
      }

      // Button loading state
      const btnText = document.getElementById('confirm-btn-text');
      const originalText = btnText.textContent;
      btnText.textContent = 'Processing Reservation...';
      confirmBookingBtn.disabled = true;

      setTimeout(() => {
        const days = calculateRentalDays();
        const totalAmount = document.getElementById('calc-grand-total').textContent;
        const refId = 'DE-' + Math.floor(10000 + Math.random() * 90000);

        const newBooking = {
          id: refId,
          car: selectedCarForBooking,
          customer: {
            name: custName,
            email: custEmail,
            phone: custPhone,
            license: custLicense,
            specialRequests: specialReq
          },
          schedule: {
            pickupLocation: pickupLoc,
            returnLocation: document.getElementById('book-return-location').value,
            pickupDate: pickupDate,
            returnDate: returnDate,
            days: days
          },
          pricing: {
            total: totalAmount,
            deposit: selectedCarForBooking.deposit,
            promoCode: activePromo ? activePromo.code : null
          },
          status: 'Confirmed',
          createdAt: new Date().toISOString()
        };

        // Save to LocalStorage
        const currentBookings = getStoredBookings();
        currentBookings.unshift(newBooking);
        saveStoredBookings(currentBookings);

        btnText.textContent = originalText;
        confirmBookingBtn.disabled = false;

        closeModal(bookingModal);
        openConfirmationModal(newBooking);
        showToast(`Booking ${refId} confirmed successfully!`, 'success');
      }, 700);
    });
  }

  // ----------------------------------------------------
  // 8. CONFIRMATION RECEIPT MODAL
  // ----------------------------------------------------
  const confirmationModal = document.getElementById('confirmation-modal');

  function openConfirmationModal(booking) {
    document.getElementById('receipt-booking-id').textContent = `#${booking.id}`;
    document.getElementById('receipt-car-name').textContent = booking.car.name;
    document.getElementById('receipt-category').textContent = booking.car.category;
    document.getElementById('receipt-cust-name').textContent = booking.customer.name;
    document.getElementById('receipt-pickup-date').textContent = booking.schedule.pickupDate;
    document.getElementById('receipt-return-date').textContent = booking.schedule.returnDate;
    document.getElementById('receipt-location').textContent = booking.schedule.pickupLocation;
    document.getElementById('receipt-total-paid').textContent = booking.pricing.total;

    openModal(confirmationModal);
  }

  const printReceiptBtn = document.getElementById('print-receipt-btn');
  if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', () => {
      window.print();
    });
  }

  const viewInMyBookingsBtn = document.getElementById('view-in-my-bookings-btn');
  if (viewInMyBookingsBtn) {
    viewInMyBookingsBtn.addEventListener('click', () => {
      closeModal(confirmationModal);
      setTimeout(openMyBookingsModal, 250);
    });
  }

  // ----------------------------------------------------
  // 9. MY BOOKINGS PORTAL MODAL
  // ----------------------------------------------------
  const myBookingsModal = document.getElementById('my-bookings-modal');
  const myBookingsBtn = document.getElementById('my-bookings-btn');
  const myBookingsList = document.getElementById('my-bookings-list');
  const noBookingsPlaceholder = document.getElementById('no-bookings-placeholder');

  function openMyBookingsModal() {
    renderMyBookingsList();
    openModal(myBookingsModal);
  }

  if (myBookingsBtn) {
    myBookingsBtn.addEventListener('click', openMyBookingsModal);
  }

  function renderMyBookingsList() {
    const bookings = getStoredBookings();
    if (!myBookingsList) return;

    myBookingsList.innerHTML = '';

    if (bookings.length === 0) {
      if (noBookingsPlaceholder) noBookingsPlaceholder.classList.remove('d-none');
      return;
    }

    if (noBookingsPlaceholder) noBookingsPlaceholder.classList.add('d-none');

    bookings.forEach(b => {
      const item = document.createElement('div');
      item.className = 'booking-history-item';
      item.innerHTML = `
        <img src="${b.car.image}" alt="${b.car.name}" class="booking-item-img">
        <div class="booking-item-info">
          <div class="d-flex justify-content-between">
            <h4 class="booking-item-title">${b.car.name}</h4>
          </div>
          <div class="booking-item-meta">
            <span><strong>Ref:</strong> #${b.id} • <strong>Dates:</strong> ${b.schedule.pickupDate} to ${b.schedule.returnDate} (${b.schedule.days} days)</span>
            <span><strong>Location:</strong> ${b.schedule.pickupLocation}</span>
            <span><strong>Total Paid:</strong> <span class="text-orange">${b.pricing.total}</span> (Deposit: $${b.pricing.deposit})</span>
          </div>
        </div>
        <div class="booking-item-actions">
          <span class="booking-status-tag">${b.status}</span>
          <button class="btn btn-outline-sm btn-print-single" data-id="${b.id}"><i class="fa-solid fa-receipt"></i> Receipt</button>
          <button class="btn btn-ghost-sm text-muted btn-cancel-booking" data-id="${b.id}" style="font-size:0.75rem;"><i class="fa-solid fa-trash"></i> Cancel</button>
        </div>
      `;
      myBookingsList.appendChild(item);
    });

    // Cancel Booking listener
    document.querySelectorAll('.btn-cancel-booking').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm(`Are you sure you want to cancel booking #${id}? 100% full refund will be initiated to your payment method.`)) {
          let current = getStoredBookings();
          current = current.filter(b => b.id !== id);
          saveStoredBookings(current);
          renderMyBookingsList();
          showToast(`Reservation #${id} successfully cancelled. Refund processed.`, 'info');
        }
      });
    });

    // View Single Receipt
    document.querySelectorAll('.btn-print-single').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const b = getStoredBookings().find(item => item.id === id);
        if (b) {
          closeModal(myBookingsModal);
          setTimeout(() => openConfirmationModal(b), 200);
        }
      });
    });
  }

  // ----------------------------------------------------
  // 10. AUTH MODAL (LOGIN & SIGNUP DEMO STATE)
  // ----------------------------------------------------
  const authModal = document.getElementById('auth-modal');
  const authButtonsContainer = document.getElementById('auth-buttons-container');
  const userProfileWidget = document.getElementById('user-profile-widget');
  const userDisplayName = document.getElementById('user-display-name');
  const userAvatar = document.getElementById('user-avatar');
  const logoutBtn = document.getElementById('logout-btn');
  const quickDemoLoginBtn = document.getElementById('quick-demo-login-btn');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  function getStoredUser() {
    try {
      const u = localStorage.getItem(STORAGE_KEY_USER);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }

  function setStoredUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      renderUserAuthUI(user);
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
      renderUserAuthUI(null);
    }
  }

  function renderUserAuthUI(user) {
    if (user) {
      if (authButtonsContainer) authButtonsContainer.classList.add('d-none');
      if (userProfileWidget) {
        userProfileWidget.classList.remove('d-none');
        userDisplayName.textContent = user.name;
        userAvatar.textContent = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      }
    } else {
      if (authButtonsContainer) authButtonsContainer.classList.remove('d-none');
      if (userProfileWidget) userProfileWidget.classList.add('d-none');
    }
  }

  // Setup modal tabs
  document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-tab-target');
      document.querySelectorAll('.auth-panel').forEach(p => p.classList.add('d-none'));
      const activePanel = document.getElementById(target);
      if (activePanel) activePanel.classList.remove('d-none');
    });
  });

  // Open auth modal buttons
  document.querySelectorAll('[data-modal="auth-modal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab') || 'login';
      const tabBtn = document.querySelector(`.modal-tab[data-tab-target="${tab}-panel"]`);
      if (tabBtn) tabBtn.click();
      closeMobileDrawer();
      openModal(authModal);
    });
  });

  if (quickDemoLoginBtn) {
    quickDemoLoginBtn.addEventListener('click', () => {
      const demoUser = { name: 'Alex Davis', email: 'alex.davis@example.com' };
      setStoredUser(demoUser);
      closeModal(authModal);
      showToast(`Welcome back, ${demoUser.name}! VIP perks active.`, 'success');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const name = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
      const user = { name: name || 'Valued Guest', email: email };
      setStoredUser(user);
      closeModal(authModal);
      showToast(`Logged in as ${user.name}!`, 'success');
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const user = { name: name || 'Valued Member', email: email };
      setStoredUser(user);
      closeModal(authModal);
      showToast(`Account created! Use code WELCOME10 for 10% off.`, 'success');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      setStoredUser(null);
      showToast('You have signed out.', 'info');
    });
  }

  // ----------------------------------------------------
  // 11. GENERAL MODAL OPEN/CLOSE HELPERS
  // ----------------------------------------------------
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('active');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('active');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.currentTarget.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  // Close modal when clicking backdrop
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m));
      closeMobileDrawer();
    }
  });

  // ----------------------------------------------------
  // 12. CONTACT FORM & NEWSLETTER VALIDATION
  // ----------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      let valid = true;

      if (!name) {
        setFieldError('name-error', 'Please enter your name.');
        valid = false;
      } else {
        clearFieldError('name-error');
      }

      if (!email || !email.includes('@')) {
        setFieldError('email-error', 'Please enter a valid email.');
        valid = false;
      } else {
        clearFieldError('email-error');
      }

      if (!phone) {
        setFieldError('phone-error', 'Please enter your phone number.');
        valid = false;
      } else {
        clearFieldError('phone-error');
      }

      if (!message) {
        setFieldError('msg-error', 'Please enter your message.');
        valid = false;
      } else {
        clearFieldError('msg-error');
      }

      if (!valid) return;

      const submitBtn = document.getElementById('contact-submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;
        showToast('Thank you! Your message has been sent to our concierge team. Expect a response in under 15 minutes.', 'success', 5000);
      }, 800);
    });
  }

  function setFieldError(elementId, msg) {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = msg;
      el.classList.add('visible');
    }
  }

  function clearFieldError(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = '';
      el.classList.remove('visible');
    }
  }

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email').value.trim();
      if (email && email.includes('@')) {
        newsletterForm.reset();
        showToast('Subscribed! Check your inbox for exclusive fleet discounts.', 'success');
      }
    });
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(qBtn => {
    qBtn.addEventListener('click', () => {
      const item = qBtn.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // ----------------------------------------------------
  // 13. MOBILE MENU & HEADER SCROLL BEHAVIOR
  // ----------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const closeMobileMenu = document.getElementById('close-mobile-menu');
  const drawerBackdrop = document.getElementById('mobile-menu-backdrop');
  const mainHeader = document.getElementById('main-header');

  function openMobileDrawer() {
    if (mobileMenuDrawer) mobileMenuDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    if (mobileMenuDrawer) mobileMenuDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMobileDrawer);
  if (closeMobileMenu) closeMobileMenu.addEventListener('click', closeMobileDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileDrawer);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  // Sticky header background change on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }

    // Active nav indicator update
    const sections = ['home', 'cars', 'about', 'services', 'reviews', 'contact'];
    const scrollPos = window.scrollY + 120;

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          document.querySelectorAll('.nav-link').forEach(nl => {
            nl.classList.remove('active');
            if (nl.getAttribute('href') === `#${id}`) nl.classList.add('active');
          });
        }
      }
    });
  });

  // Current year in footer
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

  // ----------------------------------------------------
  // INITIALIZE APP
  // ----------------------------------------------------
  renderCars();
  updateBookingsBadge();
  const existingUser = getStoredUser();
  if (existingUser) renderUserAuthUI(existingUser);

  // Expose helper globally for chatbot card links
  window.DriveEase = {
    openBookingModalById: (carId) => {
      const car = CARS.find(c => c.id === carId);
      if (car) openBookingModal(car);
    },
    openCarDetailsById: (carId) => {
      const car = CARS.find(c => c.id === carId);
      if (car) openCarDetailsModal(car);
    },
    getCars: () => CARS
  };
});
