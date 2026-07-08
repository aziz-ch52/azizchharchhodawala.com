// Initialize Lucide Icons for everything except FontAwesome
      lucide.createIcons();

      document.addEventListener('DOMContentLoaded', () => {
        // Time-based Counter Animation
        const counters = document.querySelectorAll('.counter');
        const animationDuration = 2000;

        counters.forEach((counter) => {
          const target = +counter.getAttribute('data-target');
          const startTime = performance.now();

          const updateCount = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1);
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentCount = Math.floor(easeProgress * target);
            counter.innerText = currentCount;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              counter.innerText = target;
            }
          };

          requestAnimationFrame(updateCount);
        });

        // Mock GitHub Contribution Graph
        const graphContainer = document.getElementById('github-graph');
        if (graphContainer) {
          const weeks = 52;
          const days = 7;

          for (let i = 0; i < weeks; i++) {
            const col = document.createElement('div');
            col.className = 'flex flex-col gap-1';

            for (let j = 0; j < days; j++) {
              const square = document.createElement('div');
              square.className = 'w-3 h-3 rounded-sm';

              const rand = Math.random();
              if (rand > 0.8) {
                square.classList.add('bg-emerald-500');
              } else if (rand > 0.6) {
                square.classList.add('bg-emerald-700');
              } else if (rand > 0.4) {
                square.classList.add('bg-emerald-900');
              } else {
                square.classList.add('bg-slate-800');
              }

              col.appendChild(square);
            }
            graphContainer.appendChild(col);
          }
        }

        // Mark empty (no src) project image slots so the dashed placeholder shows
        document.querySelectorAll('[data-project-img]').forEach((img) => {
          if (!img.getAttribute('src')) {
            img.closest('.project-media').classList.add('is-empty');
            img.style.display = 'none';
          }
        });

        // Scroll-triggered reveal animation
        const revealEls = document.querySelectorAll('[data-reveal]');
        if ('IntersectionObserver' in window && revealEls.length) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('is-visible');
                  observer.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
          );
          revealEls.forEach((el) => observer.observe(el));
        } else {
          revealEls.forEach((el) => el.classList.add('is-visible'));
        }
      });