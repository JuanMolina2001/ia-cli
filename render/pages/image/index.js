import html from './index.html'
const script = () => {
    const form = document.querySelector("form")
    const fileInp = document.querySelector("#file")
    const img = document.querySelector("img")
    const buttons = document.querySelector("#buttons")
    const spans = document.querySelectorAll("span")
    function hidden() {
        form.style.display = "none"
        fileInp.style.display = "none"
        img.style.height = "80vh"
        buttons.style.display = "flex"
        spans.forEach((span) => {
            span.style.display = "none"
        })
    }
    function onsubmit(e) {
        e.preventDefault()
        const inp = e.target.querySelector("input")
        const url = inp.value
        try {
            new URL(url)
            console.log("valid url")
        } catch (error) {
            console.log("invalid url")
            inp.value = ""
            inp.style.border = "1px solid red"
            setTimeout(() => {
                inp.style.border = "1px solid white"
            }, 700);
            return
        }
        img.src = url
        hidden()
    }
    function inpFileChange(e) {
        electron.invoke("openImage").then((result) => {
            if (result) {
                img.src = result
                hidden()
            }
        })
    }
    form.addEventListener("submit", onsubmit)
    file.addEventListener("click", inpFileChange)
    buttons.querySelector("#cancel").addEventListener("click", function () {
        form.style.display = "flex"
        fileInp.style.display = "block"
        fileInp.value = ""
        img.src = ""
        img.style.height = "0"
        buttons.style.display = "none"
        spans.forEach((span) => {
            span.style.display = "block"
        })
    })
    buttons.querySelector("#submit").addEventListener("click", function () {
        electron.send("image", img.src)
    })
}
export {
    html,
    script
}