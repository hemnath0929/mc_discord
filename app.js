/**
 * SHADOW PEAKES - OFFICIAL FRONTEND LOGIC
 * Handles multi-step player verification form, Discord webhook submissions,
 * dynamic edition switching, copy-to-clipboard, and canvas ambient particles.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const copyIpBtn = document.getElementById('copyIpBtn');
  const serverIpText = document.getElementById('serverIpText');
  const copyBtnText = document.getElementById('copyBtnText');

  // Multi-step elements
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  const stepIndicator1 = document.getElementById('stepIndicator1');
  const stepIndicator2 = document.getElementById('stepIndicator2');
  const stepIndicator3 = document.getElementById('stepIndicator3');
  const stepLine1 = document.getElementById('stepLine1');
  const stepLine2 = document.getElementById('stepLine2');
  const formAlert = document.getElementById('formAlert');
  const formAlertText = document.getElementById('formAlertText');
  const whitelistForm = document.getElementById('whitelistForm');

  // Step 1 controls
  const playerName = document.getElementById('playerName');
  const playerNickname = document.getElementById('playerNickname');
  const playerAge = document.getElementById('playerAge');
  const playerOccupation = document.getElementById('playerOccupation');
  const btnNext1 = document.getElementById('btnNext1');

  // Step 2 controls
  const cardJava = document.getElementById('cardJava');
  const cardBedrock = document.getElementById('cardBedrock');
  const selectedEdition = document.getElementById('selectedEdition');
  const editionBannerText = document.getElementById('editionBannerText');
  const gameUsernameLabel = document.getElementById('gameUsernameLabel');
  const gameUsername = document.getElementById('gameUsername');
  const gameUsernameHint = document.getElementById('gameUsernameHint');
  const gameType = document.getElementById('gameType');
  const gameVersion = document.getElementById('gameVersion');
  const btnBack2 = document.getElementById('btnBack2');
  const btnSubmitForm = document.getElementById('btnSubmitForm');

  // Step 3 controls
  const summaryName = document.getElementById('summaryName');
  const summaryIGN = document.getElementById('summaryIGN');
  const summaryEdition = document.getElementById('summaryEdition');
  const summaryAvatarImg = document.getElementById('summaryAvatarImg');
  const btnJoinDiscord = document.getElementById('btnJoinDiscord');
  const btnSubmitAnother = document.getElementById('btnSubmitAnother');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  let currentStep = 1;

  // ----------------------------------------------------
  // 1. Toast Notification Helper
  // ----------------------------------------------------
  function showToast(message, icon = 'fa-circle-check', color = '#00f0ff') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderColor = color;
    toast.innerHTML = `<i class="fa-solid ${icon}" style="color: ${color};"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ----------------------------------------------------
  // 2. Navbar Scroll & Mobile Menu
  // ----------------------------------------------------
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      mobileToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // ----------------------------------------------------
  // 3. Server IP Copy to Clipboard
  // ----------------------------------------------------
  if (copyIpBtn) {
    copyIpBtn.addEventListener('click', () => {
      const ip = serverIpText.textContent.trim();
      navigator.clipboard.writeText(ip).then(() => {
        copyIpBtn.classList.add('copied');
        copyBtnText.textContent = 'Copied!';
        showToast(`Server IP copied: ${ip}`, 'fa-check-double', '#10b981');

        setTimeout(() => {
          copyIpBtn.classList.remove('copied');
          copyBtnText.textContent = 'Copy IP';
        }, 3000);
      }).catch(() => {
        showToast(`Could not copy automatically: ${ip}`, 'fa-copy', '#f59e0b');
      });
    });
  }

  // ----------------------------------------------------
  // 4. Multi-Step Form Management
  // ----------------------------------------------------
  function showAlert(msg) {
    formAlertText.textContent = msg;
    formAlert.style.display = 'flex';
    formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideAlert() {
    formAlert.style.display = 'none';
  }

  function updateStepIndicators(step) {
    currentStep = step;

    // Reset indicator classes
    [stepIndicator1, stepIndicator2, stepIndicator3].forEach((ind) => {
      ind.classList.remove('active', 'completed');
    });
    stepLine1.classList.remove('active');
    stepLine2.classList.remove('active');

    // Hide all step contents
    step1.classList.remove('active');
    step2.classList.remove('active');
    step3.classList.remove('active');

    if (step === 1) {
      stepIndicator1.classList.add('active');
      step1.classList.add('active');
    } else if (step === 2) {
      stepIndicator1.classList.add('completed');
      stepIndicator2.classList.add('active');
      stepLine1.classList.add('active');
      step2.classList.add('active');
    } else if (step === 3) {
      stepIndicator1.classList.add('completed');
      stepIndicator2.classList.add('completed');
      stepIndicator3.classList.add('completed');
      stepLine1.classList.add('active');
      stepLine2.classList.add('active');
      step3.classList.add('active');
    }
  }

  // Step 1 Validation & Next Button
  if (btnNext1) {
    btnNext1.addEventListener('click', () => {
      hideAlert();

      const nameVal = playerName.value.trim();
      const ageVal = parseInt(playerAge.value.trim(), 10);
      const occVal = playerOccupation.value;

      if (!nameVal) {
        showAlert('Please enter your name.');
        playerName.focus();
        return;
      }

      if (nameVal.length < 2) {
        showAlert('Name must be at least 2 characters long.');
        playerName.focus();
        return;
      }

      if (!ageVal || isNaN(ageVal)) {
        showAlert('Please enter your age.');
        playerAge.focus();
        return;
      }

      if (ageVal < 10 || ageVal > 99) {
        showAlert('Please enter a valid age between 10 and 99.');
        playerAge.focus();
        return;
      }

      if (!occVal) {
        showAlert('Please select your current occupation.');
        playerOccupation.focus();
        return;
      }

      // Step 1 Validated -> Proceed to Step 2
      updateStepIndicators(2);
    });
  }

  // ----------------------------------------------------
  // 5. Dynamic Edition Switching (Step 2)
  // ----------------------------------------------------
  function setEdition(edition) {
    selectedEdition.value = edition;

    if (edition === 'Java') {
      cardJava.classList.add('selected');
      cardBedrock.classList.remove('selected');
      editionBannerText.innerHTML = '<i class="fa-brands fa-java text-cyan"></i> Configuring details for <strong>Java Edition</strong>';
      gameUsernameLabel.innerHTML = '<i class="fa-solid fa-signature"></i> Minecraft Java In-Game Name (IGN) <span class="req">*</span>';
      gameUsername.placeholder = 'e.g. Dream, Technoblade, Notch';
      gameUsernameHint.textContent = 'Case-sensitive Minecraft username exactly as it appears in-game';
    } else {
      cardBedrock.classList.add('selected');
      cardJava.classList.remove('selected');
      editionBannerText.innerHTML = '<i class="fa-solid fa-mobile-screen-button text-emerald"></i> Configuring details for <strong>Bedrock Edition</strong>';
      gameUsernameLabel.innerHTML = '<i class="fa-solid fa-gamepad"></i> Minecraft Bedrock Gamertag <span class="req">*</span>';
      gameUsername.placeholder = 'e.g. ShadowHunter99, Xbox Gamertag';
      gameUsernameHint.textContent = 'Your Microsoft / Xbox Gamertag used for Bedrock & PE crossplay';
    }
  }

  if (cardJava && cardBedrock) {
    cardJava.addEventListener('click', () => setEdition('Java'));
    cardBedrock.addEventListener('click', () => setEdition('Bedrock'));
  }

  // Step 2 Back Button
  if (btnBack2) {
    btnBack2.addEventListener('click', () => {
      hideAlert();
      updateStepIndicators(1);
    });
  }

  // ----------------------------------------------------
  // 6. Form Submission & Discord API Dispatch
  // ----------------------------------------------------
  if (whitelistForm) {
    whitelistForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert();

      const gameUserVal = gameUsername.value.trim();
      const gameTypeVal = gameType.value;
      const gameVerVal = gameVersion.value;
      const editionVal = selectedEdition.value;

      if (!gameUserVal) {
        showAlert(`Please enter your ${editionVal === 'Java' ? 'Minecraft IGN' : 'Bedrock Gamertag'}.`);
        gameUsername.focus();
        return;
      }

      // Prepare payload
      const payload = {
        name: playerName.value.trim(),
        nickname: playerNickname.value.trim() || 'None',
        age: playerAge.value.trim(),
        occupation: playerOccupation.value,
        edition: editionVal,
        gameUsername: gameUserVal,
        gameType: gameTypeVal,
        gameVersion: gameVerVal
      };

      // Button loading state
      const btnText = btnSubmitForm.querySelector('.btn-text');
      const btnSpinner = btnSubmitForm.querySelector('.btn-spinner');
      btnSubmitForm.disabled = true;
      btnText.style.display = 'none';
      btnSpinner.style.display = 'inline-flex';

      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to submit application.');
        }

        // Fill Step 3 Summary
        summaryName.textContent = payload.name + (payload.nickname && payload.nickname !== 'None' ? ` (${payload.nickname})` : '');
        summaryIGN.textContent = payload.gameUsername;
        summaryEdition.textContent = `${payload.edition} Edition • ${payload.gameType.split(' ')[0]}`;

        // Set Minecraft skin avatar
        if (payload.edition === 'Java') {
          summaryAvatarImg.src = `https://mc-heads.net/avatar/${encodeURIComponent(payload.gameUsername)}/80`;
        } else {
          summaryAvatarImg.src = 'https://mc-heads.net/avatar/MHF_Steve/80';
        }

        // Update Discord Invite Link if provided
        if (result.discordInvite) {
          btnJoinDiscord.href = result.discordInvite;
        }

        // Transition to Step 3
        updateStepIndicators(3);

        if (result.simulated) {
          showToast('Application simulated! (Webhook not yet set in .env)', 'fa-triangle-exclamation', '#f59e0b');
        } else {
          showToast('Application sent to Discord moderators!', 'fa-circle-check', '#10b981');
        }
      } catch (err) {
        console.error('Submission Error:', err);
        showAlert(err.message || 'An error occurred while dispatching to Discord. Please try again.');
        showToast('Submission error! Check details.', 'fa-circle-xmark', '#ef4444');
      } finally {
        btnSubmitForm.disabled = false;
        btnText.style.display = 'inline-flex';
        btnSpinner.style.display = 'none';
      }
    });
  }

  // Reset / Submit Another
  if (btnSubmitAnother) {
    btnSubmitAnother.addEventListener('click', () => {
      whitelistForm.reset();
      setEdition('Java');
      updateStepIndicators(1);
    });
  }

  // ----------------------------------------------------
  // 7. Ambient Particle Animation (Canvas)
  // ----------------------------------------------------
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 45;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.5 - 0.2;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.hue = Math.random() > 0.5 ? 186 : 155; // Cyan or Emerald tint
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
          this.y = canvas.height + 5;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 65%, ${this.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }
});
