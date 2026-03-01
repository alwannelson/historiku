document.addEventListener('DOMContentLoaded', function () {
    const sidebarWrapper = document.getElementById('sidebarWrapper');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const body = document.body;

    // Fungsi untuk membuka sidebar
    function openSidebar() {
        sidebarWrapper.classList.add('show');
        sidebarOverlay.classList.add('show');
        body.classList.add('sidebar-open');
    }

    // Fungsi untuk menutup sidebar
    function closeSidebar() {
        sidebarWrapper.classList.remove('show');
        sidebarOverlay.classList.remove('show');
        body.classList.remove('sidebar-open');
    }

    // Toggle sidebar saat tombol diklik
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            if (sidebarWrapper.classList.contains('show')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    // Tutup sidebar saat overlay diklik
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Tutup sidebar saat link menu diklik (di mobile)
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });

    // Handle resize window
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            // Desktop: pastikan sidebar terbuka dan overlay hilang
            sidebarWrapper.classList.remove('show');
            sidebarOverlay.classList.remove('show');
            body.classList.remove('sidebar-open');
        }
    });

    // Prevent klik di dalam sidebar menutup sidebar (kecuali link)
    sidebarWrapper.addEventListener('click', function (e) {
        e.stopPropagation();
    });
});