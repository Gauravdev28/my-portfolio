# 🔷 FlowCode

**FlowCode** is an intelligent C code to flowchart converter that transforms your C programs into beautiful, interactive flowcharts instantly.

![FlowCode Banner](https://img.shields.io/badge/FlowCode-v1.0-38ef7d?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## ✨ Features

- 🧠 **AI-Powered Syntax Analysis** - Automatically detects and fixes common C syntax errors
- 🎨 **Smart Flowchart Generation** - Converts C code into clean, logical flowcharts
- 🔄 **Intelligent Node Merging** - Combines related operations (e.g., prompt + input) for clarity
- 💎 **Modern UI** - Sleek Cyber-Professional theme with Teal/Emerald accents
- 🔍 **Zoom Controls** - Easily zoom in/out to view complex flowcharts
- 📥 **Download Support** - Save your flowcharts as images
- ⚡ **Real-time Preview** - Instant flowchart generation as you type

## 🚀 Live Demo

Try it live: [FlowCode Demo](#) *(Add your GitHub Pages link here)*

## 📸 Screenshots

### Main Interface
![FlowCode Interface](screenshot.png)

### Example Flowchart
![Example Flowchart](example.png)

## 🛠️ Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with modern gradients and animations
- **JavaScript (ES6+)** - Logic and flowchart rendering
- **SVG** - Arrow and connector rendering

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/ramagll/flowcode.git
cd flowcode
```

2. Open `index.html` in your browser:
```bash
open index.html
```

Or use a local server:
```bash
python3 -m http.server 8080
```

Then navigate to `http://localhost:8080`

## 💻 Usage

1. **Enter your C code** in the left panel
2. **Click "Generate Flowchart"** to create the visualization
3. **Use zoom controls** to adjust the view
4. **Download** your flowchart using the download button

### Example Code

```c
#include <stdio.h>

int main() {
    int num;
    printf("Enter a number: ");
    scanf("%d", &num);
    
    if (num % 2 == 0) {
        printf("Even");
    } else {
        printf("Odd");
    }
    
    return 0;
}
```

## 🎯 Supported C Constructs

- ✅ `if/else` statements
- ✅ `while` loops
- ✅ `for` loops
- ✅ `printf` / `scanf` (I/O operations)
- ✅ Variable assignments
- ✅ Arithmetic operations
- ✅ Nested control structures

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Gaurav**

- GitHub: [@ramagll](https://github.com/ramagll)
- LinkedIn: [gauravvagl](https://www.linkedin.com/in/gauravvagl)

## 🙏 Acknowledgments

- Inspired by the need for better C code visualization tools
- Built with modern web technologies
- Designed for students and developers learning C programming

---

⭐ **Star this repository if you found it helpful!**

Made with ❤️ by Gaurav
