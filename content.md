# Giới thiệu về Markdown Slides {.slidemain}

Chào mừng bạn đến với **Markdown Slides Framework**!

- Trình chiếu hiện đại, responsive
- Viết bài giảng bằng markdown mở rộng
- Hỗ trợ hình ảnh, bảng, liên kết, code, ...

---

# Mục tiêu bài học

- Hiểu cách viết slide bằng markdown {.text-danger}
- Biết cách trình chiếu, nhúng hình ảnh, bảng biểu {.text-success}
- Thực hành tạo slide demo


## Markdown là gì? {.slidebreak}

Markdown là ngôn ngữ đánh dấu nhẹ, dễ đọc, dễ viết.

- Được dùng rộng rãi trong tài liệu, blog, slides
- Có thể chuyển đổi sang HTML dễ dàng


## Tính năng mở rộng {.slidebreak}

- Hỗ trợ thuộc tính mở rộng với markdown-it-attrs
- Tách slide bằng `.slidebreak`
- Section lồng nhau với Heading 1 và Heading 2

---

# Demo nội dung đa dạng

## Chèn hình ảnh

![Logo EIU](https://eiu.edu.vn/wp-content/uploads/2024/12/cropped-cropped-cropped-cropped-LOGO-EIU-15_Short-logo-full-color.png){style="top:60%; left:60%; width:20%;position:absolute;"}


## Bảng dữ liệu {.slidebreak}

| STT | Họ tên      | Điểm |
|-----|------------|------|
| 1   | Nguyễn An  | 9.0  |
| 2   | Trần Bình  | 8.5  |
| 3   | Lê Cường   | 7.8  |

{.table .table-dark .table-striped}


**Wellformed the table's rowspan and/or colspan attributes, usage sample below:**

| A                       | B   | C   | D                |
| ----------------------- | --- | --- | ---------------- |
| 1                       | 11  | 111 | 1111 {rowspan=3} |
| 2 {colspan=2 rowspan=2} | 22  | 222 | 2222             |
| 3                       | 33  | 333 | 3333             |

{border=1}

## Liên kết và code {.slidebreak}

- [Trang chủ EIU](https://eiu.edu.vn)
- Đoạn code mẫu:

```js
console.log('Hello, Markdown Slides!');
```


## Danh sách lồng nhau {.slidebreak}

- Mục 1
  - Mục 1.1
  - Mục 1.2
- Mục 2

---

# Công thức toán học

## Công thức cơ bản

Công thức toán học được viết theo cú pháp LaTeX:

- Công thức inline: $E = mc^2$
- Công thức phân số: $\cfrac{a}{b} = \cfrac{c}{d}$
- Căn thức: $\sqrt{x^2 + y^2} = r$

## Công thức phức tạp {.slidebreak}

Phương trình bậc hai:

$$ax^2 + bx + c = 0$$

Nghiệm của phương trình:

$$x = \cfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

## Giới hạn, đạo hàm và tích phân {.slidebreak}

Giới hạn:

$$\lim_{x \to \infty} \cfrac{1}{x} = 0$$

Đạo hàm:

$$f'(x) = \lim_{h \to 0} \cfrac{f(x+h) - f(x)}{h}$$

Tích phân:

$$\int_{a}^{b} f(x) \, dx = F(b) - F(a)$$

## Ma trận và hệ phương trình {.slidebreak}

Ma trận:

$$A = \begin{pmatrix}
a_{11} & a_{12} & a_{13} \\\\
a_{21} & a_{22} & a_{23} \\\\
a_{31} & a_{32} & a_{33}
\end{pmatrix}$$

Hệ phương trình:

$$\begin{cases}
a_{11}x_1 + a_{12}x_2 + a_{13}x_3 = b_1 \\\\
a_{21}x_1 + a_{22}x_2 + a_{23}x_3 = b_2 \\\\
a_{31}x_1 + a_{32}x_2 + a_{33}x_3 = b_3
\end{cases}$$

# Kết thúc

Cảm ơn bạn đã theo dõi!

- Liên hệ: [EIU](https://eiu.edu.vn)
- Chúc bạn thành công!
