export const dialogFormModel = [
    {
        required: true,
        type: "color",
        name: "overlay_bc",
        label: "overlay background color",
    },
    {
        required: true,
        type: "color",
        name: "content_bc",
        label: "content background color",
    },
    {
        required: true,
        type: "number",
        name: "content_width",
        step: "10",
        label: "content width: (rem)",
        isValid: val => (val) && val >= 10 & val <= 80,
        errMsg: "dialog should be in range between 10-80 rem "
    },
    {
        required: true,
        step: "1000",
        type: "number",
        name: "timer_ms",
        label: "timer to delay closing: (ms)",
        isValid: val => (val) && (val >= 0 && val % 100 === 0),
        errMsg: "timer should be Multiples of a 100 and minimum 1000(1 sec)"
    },
    {
        required: true,
        type: "text",
        name: "content_text",
        step: "100",
        label: "Type some Content",
        isValid: val => (val) && val.length >= 1,
        errMsg: "dialog should be contain some content!"
    },
    {
        required: true,
        type: "file",
        name: "image",
        label: "Image"
    },

]
