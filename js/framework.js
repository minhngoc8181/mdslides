// Lấy tham chiếu đến các plugins của Reveal.js
// const RevealMarkdown = window.RevealMarkdown;
// const RevealHighlight = window.RevealHighlight;
// const RevealNotes = window.RevealNotes;
// const RevealMath = window.RevealMath;

document.addEventListener('DOMContentLoaded', () => {
    const slidesContainer = document.getElementById('slides-container');
    const contentFilePath = 'content.md';

    // Khởi tạo markdown-it với plugin markdown-it-attrs
    const md = window.markdownit({
        html: true,        // Cho phép HTML tags trong Markdown
        linkify: true,     // Tự động chuyển đổi URL thành link
        typographer: true  // Cho phép một số thay thế và dấu ngoặc kép thông minh
    }).use(window.markdownItAttrs);

    async function loadAndRenderMarkdown() {
        try {
            const response = await fetch(contentFilePath);
            if (!response.ok) {
                throw new Error(`Không thể tải ${contentFilePath}: ${response.statusText}`);
            }
            const markdownText = await response.text();
            const htmlContent = md.render(markdownText);
            parseAndStructureSlides(htmlContent);
            initializeReveal();
        } catch (error) {
            console.error('Lỗi khi tải hoặc render Markdown:', error);
            slidesContainer.innerHTML = `<section><p class="text-danger">Lỗi: ${error.message}</p></section>`;
            initializeReveal(); // Khởi tạo Reveal ngay cả khi có lỗi để hiển thị thông báo
        }
    }

    function parseAndStructureSlides(htmlContent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        // Mảng lưu trữ tất cả các section (từ các H1)
        const sections = [];

        // Biến tạm để lưu trữ nội dung của section đang được xử lý
        let currentSection = null;
        let currentSectionNodes = [];
        let hasSlideMain = false;
        let contentIndex = 0; // Vị trí chèn mục lục

        // 1. Tách thành các section theo H1
        Array.from(tempDiv.childNodes).forEach(node => {
            // Bắt đầu section mới khi gặp H1
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'H1') {
                // Lưu section cũ nếu có
                if (currentSection) {
                    sections.push({
                        header: currentSection,
                        content: currentSectionNodes,
                        isSlideMain: currentSection.classList.contains('slidemain')
                    });
                }

                // Tạo section mới
                currentSection = node.cloneNode(true);
                currentSectionNodes = [];

                // Kiểm tra nếu là slide main đầu tiên
                if (currentSection.classList.contains('slidemain') && !hasSlideMain) {
                    hasSlideMain = true;
                    contentIndex = sections.length + 1; // +1 vì section này chưa được thêm vào mảng sections
                }
            }
            // Thêm nội dung vào section hiện tại
            else if (currentSection) {
                currentSectionNodes.push(node.cloneNode(true));
            }
        });

        // Thêm section cuối cùng nếu có
        if (currentSection) {
            sections.push({
                header: currentSection,
                content: currentSectionNodes,
                isSlideMain: currentSection.classList.contains('slidemain')
            });
        }

        // Nếu không có slide main thì mục lục sẽ được chèn vào đầu
        if (!hasSlideMain) {
            contentIndex = 0;
        }

        // 2. Tạo mục lục
        const tocSlide = document.createElement('section');
        tocSlide.setAttribute('data-state', 'toc-slide');
        tocSlide.innerHTML = '<h2>Mục lục</h2>';
        const tocList = document.createElement('ul');
        tocSlide.appendChild(tocList);

        // 3. Xử lý từng section và tạo các slide tương ứng
        sections.forEach((section, index) => {
            const sectionHeader = section.header;
            const sectionContent = section.content;

            // Tạo ID cho section nếu chưa có
            const sectionId = sectionHeader.id || `section-${index}`;
            if (!sectionHeader.id) sectionHeader.id = sectionId;

            // Thêm vào mục lục (nếu không phải là section main)
            if (!section.isSlideMain) {
                const tocItem = document.createElement('li');
                const tocLink = document.createElement('a');
                tocLink.href = `#/${sectionId}`;
                tocLink.textContent = sectionHeader.textContent;
                tocItem.appendChild(tocLink);
                tocList.appendChild(tocItem);
            }

            // Xử lý section main đặc biệt
            if (section.isSlideMain) {
                const titleSlide = document.createElement('section');
                titleSlide.classList.add('title-slide');

                // Sao chép thuộc tính từ H1 sang slide, trừ class .slidemain
                Array.from(sectionHeader.attributes).forEach(attr => {
                    if (attr.name !== 'class' || (attr.name === 'class' && !attr.value.includes('slidemain'))) {
                        titleSlide.setAttribute(attr.name, attr.value);
                    }
                });

                // Thêm H1 và nội dung vào slide main
                titleSlide.appendChild(sectionHeader.cloneNode(true));
                sectionContent.forEach(node => {
                    titleSlide.appendChild(node.cloneNode(true));
                });

                // Thêm vào slidesContainer
                slidesContainer.appendChild(titleSlide);
            }
            // Xử lý các section thường
            else {
                const mainSection = document.createElement('section');
                mainSection.id = sectionId;

                // Sao chép thuộc tính từ H1 sang section
                transferAttributes(sectionHeader, mainSection);

                // Tìm các điểm chia slide (.slidebreak)
                const subsections = [[]]; // Mảng các subsection, mỗi phần tử là 1 mảng các node
                let currentSubsectionIndex = 0;

                // Thêm H1 vào subsection đầu tiên
                subsections[0].push(sectionHeader.cloneNode(true));

                // Phân tách nội dung thành các subsection theo .slidebreak
                sectionContent.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE &&
                        node.classList &&
                        node.classList.contains('slidebreak')) {
                        // Tạo subsection mới
                        currentSubsectionIndex++;
                        subsections.push([]);

                        // Thêm H1 vào đầu subsection mới
                        subsections[currentSubsectionIndex].push(sectionHeader.cloneNode(true));

                        // Thêm phần tử .slidebreak như phần tử đầu tiên sau H1 trong subsection mới
                        subsections[currentSubsectionIndex].push(node.cloneNode(true));
                    } else {
                        // Thêm node vào subsection hiện tại
                        subsections[currentSubsectionIndex].push(node.cloneNode(true));
                    }
                });

                // Tạo slide cho mỗi subsection
                subsections.forEach((subsectionNodes, i) => {
                    const slide = createSlideFromContent(subsectionNodes);
                    mainSection.appendChild(slide);
                });

                // Thêm vào slidesContainer
                slidesContainer.appendChild(mainSection);
            }
        });

        // 4. Chèn mục lục vào vị trí thích hợp
        if (tocList.children.length > 0) {
            if (contentIndex === 0) {
                // Đặt mục lục vào đầu
                slidesContainer.prepend(tocSlide);
            } else if (contentIndex < slidesContainer.children.length) {
                // Chèn mục lục vào sau section có index = contentIndex
                const afterElement = slidesContainer.children[contentIndex - 1];
                afterElement.after(tocSlide);
            } else {
                // Nếu vị trí chèn vượt quá số lượng section, đặt ở cuối
                slidesContainer.appendChild(tocSlide);
            }
        }
    }

    function createSlideFromContent(contentNodes) {
        const slideSection = document.createElement('section');
        contentNodes.forEach(node => {
            slideSection.appendChild(node.cloneNode(true));
        });
        return slideSection;
    }

    function transferAttributes(sourceNode, targetNode) {
        if (sourceNode && targetNode && sourceNode.attributes) {
            Array.from(sourceNode.attributes).forEach(attr => {
                // Không chuyển class 'slidebreak'
                if (attr.name === 'class' && attr.value.includes('slidebreak')) {
                    const newClasses = attr.value.replace('slidebreak', '').trim();
                    if (newClasses) {
                        targetNode.setAttribute('class', (targetNode.getAttribute('class') || '') + ' ' + newClasses);
                    }
                } else {
                    targetNode.setAttribute(attr.name, attr.value);
                }
            });
        }
    }


    function initializeReveal() {
        Reveal.initialize({
            controls: true,
            progress: true,
            history: true,
            center: false,
            slideNumber: 'c/t', // Hiển thị số slide hiện tại / tổng số slide
            width: 1920,        // Chiều rộng cơ sở của slide
            height: 1080,       // Chiều cao cơ sở của slide
            margin: 0.04,      // Tỷ lệ lề xung quanh nội dung slide
            minScale: 0.2,
            maxScale: 1.0,
            transition: 'slide', // 'none', 'fade', 'slide', 'convex', 'concave', 'zoom'
            backgroundTransition: 'fade',
            plugins: [RevealMarkdown, RevealHighlight, RevealNotes, RevealMath.MathJax3],
            math: {
                mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
                // config: 'TeX-AMS_HTML-full',
                // tex: {
                //     packages: ['base', 'ams', 'noerrors', 'noundefined', 'newcommand', 'boldsymbol', 'amsmath', 'amssymb'],
                //     macros: {},
                //     inlineMath: [['$', '$'], ['\\(', '\\)']],
                //     displayMath: [['$$', '$$'], ['\\[', '\\]']],
                //     processEscapes: true,
                //     processEnvironments: true,
                //     tagSide: 'right',
                //     tagIndent: '0.8em'
                // },
                // chtml: {
                //     scale: 1,
                //     displayAlign: 'center',
                //     displayIndent: '0'
                // },
                // svg: {
                //     scale: 1,
                //     displayAlign: 'center',
                //     displayIndent: '0'
                // }
            },

            // Cấu hình cho RevealHighlight (nếu cần)
            highlight: {
                // escapeHTML: false // Tắt nếu bạn muốn nhúng HTML trong khối mã (cẩn thận XSS)
            }
        }).then(() => {
            // Gọi sync sau khi các slide đã được thêm vào DOM
            Reveal.sync();
            Reveal.layout(); // Đảm bảo layout được cập nhật

            // // Đảm bảo MathJax render lại các công thức toán học
            // if (typeof MathJax !== 'undefined') {
            //     // Hàm điều chỉnh style cho MathJax sau khi render
            //     // const fixMathJaxAlignment = function () {
            //     //     return;
            //     //     // Tìm tất cả các container MathJax
            //     //     document.querySelectorAll('mjx-container').forEach(container => {
            //     //         // Đảm bảo container được căn giữa
            //     //         container.style.display = 'flex';
            //     //         container.style.justifyContent = 'center';
            //     //         container.style.width = '100%';
            //     //         container.style.margin = '1em auto';

            //     //         // Kiểm tra nếu là display math (không phải inline)
            //     //         if (container.hasAttribute('display')) {
            //     //             // Tìm phần tử cha (thường là p) và đặt text-align: center
            //     //             let parent = container.parentElement;
            //     //             if (parent && parent.tagName.toLowerCase() === 'p') {
            //     //                 parent.style.textAlign = 'center';
            //     //             }
            //     //         }
            //     //     });
            //     // };

            //     // // Thêm hook để render MathJax tối ưu hơn
            //     // Reveal.addEventListener('slidechanged', function () {
            //     //     if (MathJax.typesetPromise) {
            //     //         MathJax.typesetPromise().then(fixMathJaxAlignment);
            //     //     }
            //     // });

            //     // // Render ngay lần đầu tiên
            //     // MathJax.typesetPromise && MathJax.typesetPromise().then(fixMathJaxAlignment);
            // }
        });
    }

    loadAndRenderMarkdown();
});