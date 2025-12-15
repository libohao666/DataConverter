const cardData = [
    // 
    {
        title: "HIF8",
        description: "Ascend custom floating-point format for specific deep learning computing scenarios.",
        link: "https://arxiv.org/pdf/2409.16626",
        specs: [
            { label: "Bit width", value: "8" }
        ],
        converterId: "jsconverter_ascend",
        converterType: "ascend",
        bits: 8
    },

    // IEEE FLOAT
    {
        title: "FLOAT64",
        description: "64-bit double-precision floating-point number, providing high-precision computing, widely used in scientific computing and engineering fields.",
        link: "https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8766229",
        specs: [
            { label: "Sign width", value: "1" },
            { label: "Exponent width", value: "11" },
            { label: "Mantissa width", value: "52" }
        ],
        converterId: "jsconverter_float64",
        converterType: "float",
        signBits: 1,
        exponentBits: 11,
        mantissaBits: 52
    },
    {
        title: "FLOAT32",
        description: "32-bit single-precision floating-point number, widely used in general computing and scientific computing fields.",
        link: "https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8766229",
        specs: [
            { label: "Sign width", value: "1" },
            { label: "Exponent width", value: "8" },
            { label: "Mantissa width", value: "23" }
        ],
        converterId: "jsconverter_float32",
        converterType: "float",
        signBits: 1,
        exponentBits: 8,
        mantissaBits: 23
    },
    {
        title: "TF32",
        description: "TensorFloat (TF32) is a TensorCore data format developed by NVIDIA based on GPUs of the Ampere architecture. Using TF32 on the A100 is 8 times faster than using the FP32 CUDA Core on the V100.",
        link: "https://en.wikipedia.org/wiki/TensorFloat-32",
        specs: [
            { label: "Sign width", value: "1" },
            { label: "Exponent width", value: "8" },
            { label: "Mantissa width", value: "10" }
        ],
        converterId: "jsconverter_tfloat32",
        converterType: "float",
        signBits: 1,
        exponentBits: 8,
        mantissaBits: 10
    },
    {
        title: "HF32",
        description: "HF32 is a single-precision floating-point type developed by Ascend for internal operator calculation. The following figure shows the comparison between HF32 and other common data types. Therefore, HF32 and float32 support the same value range, but the mantissa bit precision (11 bits) is close to that of FP16 (10 bits). By reducing precision, the HF32 single-precision data type replaces the original float32 single-precision data type, which greatly reduces the space occupied by the data and improves the performance.",
        link: "https://www.hiascend.com/doc_center/source/zh/canncommercial/80RC2/devaids/auxiliarydevtool/atlasatc_16_0101.html",
        specs: [
            { label: "Sign width", value: "1" },
            { label: "Exponent width", value: "8" },
            { label: "Mantissa width", value: "11" }
        ],
        converterId: "jsconverter_hfloat32",
        converterType: "float",
        signBits: 1,
        exponentBits: 8,
        mantissaBits: 11
    },
    {
        title: "FLOAT16",
        description: "16-bit half-precision floating-point number, commonly used in deep learning and graphics processing.",
        link: "https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8766229",
        specs: [
            { label: "Sign width", value: "1" },
            { label: "Exponent width", value: "5" },
            { label: "Mantissa width", value: "10" }
        ],
        converterId: "jsconverter_float16",
        converterType: "float",
        signBits: 1,
        exponentBits: 5,
        mantissaBits: 10
    },
    {
        title: "BFLOAT6",
        description: "16-bit brain floating-point number, maintaining the same exponent range as 32-bit floating-point numbers but with lower precision, suitable for deep learning training and inference.",
        link: "https://en.wikipedia.org/wiki/Bfloat16_floating-point_format",
        specs: [
            { label: "Sign width", value: "1" },
            { label: "Exponent width", value: "8" },
            { label: "Mantissa width", value: "7" }
        ],
        converterId: "jsconverter_bfloat16",
        converterType: "float",
        signBits: 1,
        exponentBits: 8,
        mantissaBits: 7
    },
    {
        title: "FLOAT8_E4M3",
        description: "8-bit floating-point number with 4-bit exponent and 3-bit mantissa, optimized for deep learning, providing a wider dynamic range.",
        link: "https://arxiv.org/pdf/2209.05433.pdf",
        specs: [
            { label: "Sign width", value: "1" },
            { label: "Exponent width", value: "4" },
            { label: "Mantissa width", value: "3" }
        ],
        converterId: "jsconverter_float8_e4m3",
        converterType: "float",
        signBits: 1,
        exponentBits: 4,
        mantissaBits: 3
    },
    {
        title: "FLOAT8_E5M2",
        description: "8-bit floating-point number with 5-bit exponent and 2-bit mantissa, following IEEE 754 special value representation specifications, suitable for gradient representation in deep learning.",
        link: "https://arxiv.org/pdf/2209.05433.pdf",
        specs: [
            { label: "Sign width", value: "1" },
            { label: "Exponent width", value: "5" },
            { label: "Mantissa width", value: "2" }
        ],
        converterId: "jsconverter_float8_e5m2",
        converterType: "float",
        signBits: 1,
        exponentBits: 5,
        mantissaBits: 2
    },
    {
        title: "FLOAT8_E8M0",
        description: "8-bit floating-point number with 8-bit exponent and 0-bit mantissa.",
        link: "https://arxiv.org/pdf/2209.05433.pdf",
        specs: [
            { label: "Sign width", value: "0" },
            { label: "Exponent width", value: "8" },
            { label: "Mantissa width", value: "0" }
        ],
        converterId: "jsconverter_float8_e8m0",
        converterType: "float",
        signBits: 0,
        exponentBits: 8,
        mantissaBits: 0
    },
    {
        title: "FLOAT6_E3M2",
        description: "6-bit floating-point number with 3-bit exponent and 2-bit mantissa.",
        link: "https://arxiv.org/pdf/2209.05433.pdf",
        specs: [
            { label: "Sign width", value: "1" },
            { label: "Exponent width", value: "3" },
            { label: "Mantissa width", value: "2" }
        ],
        converterId: "jsconverter_float6_e3m2",
        converterType: "float",
        signBits: 1,
        exponentBits: 3,
        mantissaBits: 2
    },
    {
        title: "FLOAT6_E2M3",
        description: "6-bit floating-point number with 2-bit exponent and 3-bit mantissa.",
        link: "https://arxiv.org/pdf/2209.05433.pdf",
        specs: [
            { label: "Sign width", value: "1" },
            { label: "Exponent width", value: "2" },
            { label: "Mantissa width", value: "3" }
        ],
        converterId: "jsconverter_float6_e3m2",
        converterType: "float",
        signBits: 1,
        exponentBits: 2,
        mantissaBits: 3
    },
    {
        title: "FLOAT4_E2M1",
        description: "4-bit floating-point number with 2-bit exponent and 1-bit mantissa, used for extremely low-precision floating-point computing.",
        link: "https://arxiv.org/pdf/2208.09225.pdf",
        specs: [
            { label: "Sign width", value: "1" },
            { label: "Exponent width", value: "2" },
            { label: "Mantissa width", value: "1" }
        ],
        converterId: "jsconverter_float4_e2m1",
        converterType: "float",
        signBits: 1,
        exponentBits: 2,
        mantissaBits: 1
    },
    {
        title: "FLOAT4_E1M2",
        description: "4-bit floating-point number with 1-bit exponent and 2-bit mantissa, providing different precision and dynamic range trade-offs.",
        link: "https://arxiv.org/pdf/2208.09225.pdf",
        specs: [
            { label: "Sign width", value: "1" },
            { label: "Exponent width", value: "1" },
            { label: "Mantissa width", value: "2" }
        ],
        converterId: "jsconverter_float4_e1m2",
        converterType: "float",
        signBits: 1,
        exponentBits: 1,
        mantissaBits: 2
    },

    // INT
    {
        title: "INT64",
        description: "64-bit integer, used in computing scenarios requiring a large numerical range.",
        link: "https://www.iso.org/standard/57692.html",
        specs: [
            { label: "Bit width", value: "64" },
            { label: "Range", value: "-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807" }
        ],
        converterId: "jsconverter_int64",
        converterType: "int",
        bits: 64
    },
    {
        title: "INT32",
        description: "32-bit integer, widely used in general computing and system programming.",
        link: "https://www.iso.org/standard/57692.html",
        specs: [
            { label: "Bit width", value: "32" },
            { label: "Range", value: "-2,147,483,648 to 2,147,483,647" }
        ],
        converterId: "jsconverter_int32",
        converterType: "int",
        bits: 32
    },
    {
        title: "INT16",
        description: "16-bit integer, used in scenarios requiring a balance between precision and storage.",
        link: "https://www.iso.org/standard/57692.html",
        specs: [
            { label: "Bit width", value: "16" },
            { label: "Range", value: "-32,768 to 32,767" }
        ],
        converterId: "jsconverter_int16",
        converterType: "int",
        bits: 16
    },
    {
        title: "INT8",
        description: "8-bit integer, widely used for quantization inference in deep learning, can significantly reduce computational and storage requirements.",
        link: "https://arxiv.org/pdf/1609.08144.pdf",
        specs: [
            { label: "Bit width", value: "8" },
            { label: "Range", value: "-128 to 127" }
        ],
        converterId: "jsconverter_int8",
        converterType: "int",
        bits: 8
    },
    {
        title: "INT4",
        description: "4-bit integer, used for extremely low-precision neural network computing, further reducing computational and storage requirements.",
        link: "https://arxiv.org/pdf/1704.05047.pdf",
        specs: [
            { label: "Bit width", value: "4" },
            { label: "Range", value: "-8 to 7" }
        ],
        converterId: "jsconverter_int4",
        converterType: "int",
        bits: 4
    }
];
