import type { Product } from "@/types";
import { axis, buildVariants } from "./variant-builder";

const IMG = "/products";

/**
 * Server-only product catalog. Nothing here is imported by a component — the
 * UI reaches it through /api/products, so swapping this for a real database or
 * commerce backend touches only `src/server/repository.ts`.
 */
export const PRODUCTS: Product[] = [
  (() => {
    const axes = [
      axis("storage", "Storage", [
        { id: "256gb", label: "256 GB" },
        { id: "512gb", label: "512 GB" },
        { id: "1tb", label: "1 TB" },
      ]),
      axis("colour", "Colour", [
        { id: "blue", label: "Deep Blue", swatch: "#2f4a72" },
        { id: "silver", label: "Silver", swatch: "#c9ccd2" },
        { id: "black", label: "Space Black", swatch: "#24252a" },
      ]),
    ];
    const price: Record<string, [number, number]> = {
      "256gb": [134_900, 139_900],
      "512gb": [154_900, 159_900],
      "1tb": [174_900, 179_900],
    };
    const imageIndex: Record<string, number> = { blue: 0, silver: 1, black: 2 };

    return {
      id: "iphone-17-pro",
      slug: "iphone-17-pro",
      name: "iPhone 17 Pro",
      brand: "Apple",
      category: "mobiles" as const,
      images: [
        `${IMG}/iphone-17-pro-blue.jpg`,
        `${IMG}/iphone-17-pro-silver.jpg`,
        `${IMG}/iphone-17-pro-black.jpg`,
      ],
      rating: 4.8,
      ratingCount: 12_486,
      highlights: [
        "6.3-inch Super Retina XDR display with ProMotion",
        "A19 Pro chip with 6-core GPU",
        "48MP Fusion main camera with 4x Telephoto",
        "Up to 31 hours of video playback",
      ],
      specs: [
        { label: "Display", value: "6.3-inch OLED, 120Hz" },
        { label: "Processor", value: "A19 Pro" },
        { label: "Rear camera", value: "48MP + 48MP + 12MP" },
        { label: "Front camera", value: "18MP Center Stage" },
        { label: "Battery", value: "3,600 mAh" },
        { label: "Warranty", value: "1 year manufacturer warranty" },
      ],
      variantAxes: axes,
      variants: buildVariants(axes, (selection) => {
        const [amount, mrp] = price[selection.storage];
        return {
          price: amount,
          mrp,
          imageIndex: imageIndex[selection.colour],
          inStock: !(selection.storage === "1tb" && selection.colour === "silver"),
        };
      }),
    };
  })(),

  (() => {
    const axes = [
      axis("storage", "Storage", [
        { id: "256gb", label: "256 GB" },
        { id: "512gb", label: "512 GB" },
      ]),
      axis("colour", "Colour", [
        { id: "grey", label: "Titanium Grey", swatch: "#6c7076" },
        { id: "black", label: "Titanium Black", swatch: "#1d1e22" },
      ]),
    ];
    const price: Record<string, [number, number]> = {
      "256gb": [129_999, 139_999],
      "512gb": [141_999, 151_999],
    };

    return {
      id: "galaxy-s25-ultra",
      slug: "galaxy-s25-ultra",
      name: "Galaxy S25 Ultra",
      brand: "Samsung",
      category: "mobiles" as const,
      images: [
        `${IMG}/galaxy-s25-ultra-grey.jpg`,
        `${IMG}/galaxy-s25-ultra-black.jpg`,
      ],
      rating: 4.7,
      ratingCount: 9_213,
      highlights: [
        "6.9-inch Dynamic AMOLED 2X, 120Hz",
        "Snapdragon 8 Elite for Galaxy",
        "200MP wide camera with 5x optical zoom",
        "Built-in S Pen",
      ],
      specs: [
        { label: "Display", value: "6.9-inch AMOLED, 120Hz" },
        { label: "Processor", value: "Snapdragon 8 Elite" },
        { label: "Rear camera", value: "200MP + 50MP + 50MP + 10MP" },
        { label: "Battery", value: "5,000 mAh, 45W charging" },
        { label: "RAM", value: "12 GB" },
        { label: "Warranty", value: "1 year manufacturer warranty" },
      ],
      variantAxes: axes,
      variants: buildVariants(axes, (selection) => {
        const [amount, mrp] = price[selection.storage];
        return {
          price: amount,
          mrp,
          imageIndex: selection.colour === "grey" ? 0 : 1,
        };
      }),
    };
  })(),

  (() => {
    const axes = [
      axis("config", "Memory", [
        { id: "12-256", label: "12 GB / 256 GB" },
        { id: "16-512", label: "16 GB / 512 GB" },
      ]),
      axis("colour", "Colour", [
        { id: "ocean", label: "Midnight Ocean", swatch: "#123a5c" },
        { id: "dawn", label: "Arctic Dawn", swatch: "#e6ddd0" },
      ]),
    ];
    const price: Record<string, [number, number]> = {
      "12-256": [69_999, 72_999],
      "16-512": [76_999, 79_999],
    };

    return {
      id: "oneplus-13",
      slug: "oneplus-13",
      name: "OnePlus 13",
      brand: "OnePlus",
      category: "mobiles" as const,
      // Single photograph supplied; both colourways share it.
      images: [`${IMG}/oneplus-13.jpg`],
      rating: 4.6,
      ratingCount: 5_874,
      highlights: [
        "6.82-inch 2K ProXDR display",
        "Snapdragon 8 Elite with 6,000 mAh battery",
        "Hasselblad triple 50MP camera system",
        "100W SuperVOOC wired charging",
      ],
      specs: [
        { label: "Display", value: "6.82-inch LTPO AMOLED, 120Hz" },
        { label: "Processor", value: "Snapdragon 8 Elite" },
        { label: "Rear camera", value: "50MP + 50MP + 50MP" },
        { label: "Battery", value: "6,000 mAh, 100W charging" },
        { label: "Water resistance", value: "IP68 / IP69" },
        { label: "Warranty", value: "1 year manufacturer warranty" },
      ],
      variantAxes: axes,
      variants: buildVariants(axes, (selection) => {
        const [amount, mrp] = price[selection.config];
        return {
          price: amount,
          mrp,
          imageIndex: 0,
          inStock: selection.config !== "16-512" || selection.colour !== "dawn",
        };
      }),
    };
  })(),

  (() => {
    const axes = [
      axis("storage", "Storage", [
        { id: "256gb", label: "256 GB SSD" },
        { id: "512gb", label: "512 GB SSD" },
      ]),
      axis("colour", "Colour", [
        { id: "midnight", label: "Midnight", swatch: "#2b3242" },
        { id: "starlight", label: "Starlight", swatch: "#dfd7c8" },
      ]),
    ];
    const price: Record<string, [number, number]> = {
      "256gb": [99_900, 114_900],
      "512gb": [119_900, 134_900],
    };

    return {
      id: "macbook-air-m4",
      slug: "macbook-air-m4",
      name: "MacBook Air 13-inch M4",
      brand: "Apple",
      category: "laptops" as const,
      // Only one photograph was supplied, so both finishes share it; the
      // colour swatches still show which one is selected.
      images: [`${IMG}/macbook-air-m4.jpg`],
      rating: 4.9,
      ratingCount: 7_940,
      highlights: [
        "13.6-inch Liquid Retina display",
        "M4 chip with 10-core CPU and 8-core GPU",
        "Up to 18 hours of battery life",
        "Fanless design at 1.24 kg",
      ],
      specs: [
        { label: "Display", value: "13.6-inch Liquid Retina" },
        { label: "Processor", value: "Apple M4" },
        { label: "Memory", value: "16 GB unified" },
        { label: "Battery", value: "Up to 18 hours" },
        { label: "Weight", value: "1.24 kg" },
        { label: "Warranty", value: "1 year limited warranty" },
      ],
      variantAxes: axes,
      variants: buildVariants(axes, (selection) => {
        const [amount, mrp] = price[selection.storage];
        return {
          price: amount,
          mrp,
          imageIndex: 0,
        };
      }),
    };
  })(),

  (() => {
    const axes = [
      axis("storage", "Storage", [
        { id: "512gb", label: "512 GB SSD" },
        { id: "1tb", label: "1 TB SSD" },
      ]),
      axis("colour", "Finish", [
        { id: "platinum", label: "Platinum", swatch: "#c2c6cc" },
        { id: "graphite", label: "Graphite", swatch: "#33363c" },
      ]),
    ];
    const price: Record<string, [number, number]> = {
      "512gb": [164_990, 189_990],
      "1tb": [184_990, 209_990],
    };

    return {
      id: "dell-xps-14",
      slug: "dell-xps-14",
      name: "Dell XPS 14",
      brand: "Dell",
      category: "laptops" as const,
      // Single photograph supplied; both finishes share it.
      images: [`${IMG}/dell-xps-14.jpg`],
      rating: 4.5,
      ratingCount: 2_318,
      highlights: [
        "14.5-inch 3.2K OLED touch display",
        "Intel Core Ultra 7 with RTX 4050 graphics",
        "CNC machined aluminium chassis",
        "Quad speakers tuned by Dolby Atmos",
      ],
      specs: [
        { label: "Display", value: "14.5-inch 3.2K OLED" },
        { label: "Processor", value: "Intel Core Ultra 7 155H" },
        { label: "Graphics", value: "NVIDIA RTX 4050 6 GB" },
        { label: "Memory", value: "32 GB LPDDR5x" },
        { label: "Weight", value: "1.74 kg" },
        { label: "Warranty", value: "1 year onsite warranty" },
      ],
      variantAxes: axes,
      variants: buildVariants(axes, (selection) => {
        const [amount, mrp] = price[selection.storage];
        return {
          price: amount,
          mrp,
          imageIndex: 0,
          inStock:
            selection.storage !== "1tb" || selection.colour !== "platinum",
        };
      }),
    };
  })(),

  (() => {
    const axes = [
      axis("colour", "Colour", [
        { id: "black", label: "Black", swatch: "#26272c" },
        { id: "silver", label: "Platinum Silver", swatch: "#cfd2d8" },
      ]),
    ];

    return {
      id: "sony-wh-1000xm6",
      slug: "sony-wh-1000xm6",
      name: "Sony WH-1000XM6",
      brand: "Sony",
      category: "audio" as const,
      images: [`${IMG}/sony-xm6-black.jpg`, `${IMG}/sony-xm6-silver.jpg`],
      rating: 4.7,
      ratingCount: 15_602,
      highlights: [
        "Industry-leading adaptive noise cancellation",
        "Up to 40 hours of playback",
        "Multipoint pairing across two devices",
        "Foldable design with hard carry case",
      ],
      specs: [
        { label: "Type", value: "Over-ear, closed back" },
        { label: "Driver", value: "30 mm carbon fibre" },
        { label: "Battery", value: "40 hours with ANC" },
        { label: "Charging", value: "USB-C, 3 min for 3 hours" },
        { label: "Codecs", value: "LDAC, AAC, SBC" },
        { label: "Warranty", value: "1 year manufacturer warranty" },
      ],
      variantAxes: axes,
      variants: buildVariants(axes, (selection) => ({
        price: 34_990,
        mrp: 39_990,
        imageIndex: selection.colour === "black" ? 0 : 1,
      })),
    };
  })(),

  (() => {
    const axes = [
      axis("colour", "Colour", [
        { id: "white", label: "White", swatch: "#f0f1f4" },
      ]),
    ];

    return {
      id: "airpods-pro-3",
      slug: "airpods-pro-3",
      name: "AirPods Pro 3",
      brand: "Apple",
      category: "audio" as const,
      images: [`${IMG}/airpods-pro-3-white.jpg`],
      rating: 4.6,
      ratingCount: 21_045,
      highlights: [
        "Active Noise Cancellation with Adaptive Audio",
        "Live Translation and heart-rate sensing",
        "Up to 8 hours of listening per charge",
        "IP57 dust and water resistance",
      ],
      specs: [
        { label: "Type", value: "In-ear, noise cancelling" },
        { label: "Chip", value: "Apple H3" },
        { label: "Battery", value: "8 hours, 24 hours with case" },
        { label: "Charging", value: "USB-C and MagSafe" },
        { label: "Rating", value: "IP57" },
        { label: "Warranty", value: "1 year limited warranty" },
      ],
      variantAxes: axes,
      variants: buildVariants(axes, () => ({ price: 25_900, mrp: 27_900 })),
    };
  })(),

  (() => {
    const axes = [
      axis("size", "Case size", [
        { id: "42mm", label: "42 mm" },
        { id: "46mm", label: "46 mm" },
      ]),
      axis("colour", "Colour", [
        { id: "black", label: "Jet Black", swatch: "#212227" },
        { id: "silver", label: "Silver", swatch: "#ccd0d6" },
      ]),
    ];
    const price: Record<string, [number, number]> = {
      "42mm": [46_900, 49_900],
      "46mm": [49_900, 52_900],
    };

    return {
      id: "apple-watch-series-11",
      slug: "apple-watch-series-11",
      name: "Apple Watch Series 11",
      brand: "Apple",
      category: "wearables" as const,
      images: [
        `${IMG}/apple-watch-11-black.jpg`,
        `${IMG}/apple-watch-11-silver.jpg`,
      ],
      rating: 4.8,
      ratingCount: 8_770,
      highlights: [
        "Always-On Retina display up to 2000 nits",
        "Hypertension notifications and sleep score",
        "24-hour battery life with fast charging",
        "5G cellular option with eSIM",
      ],
      specs: [
        { label: "Display", value: "LTPO3 OLED, Always-On" },
        { label: "Chip", value: "Apple S10 SiP" },
        { label: "Battery", value: "Up to 24 hours" },
        { label: "Sensors", value: "ECG, SpO2, temperature" },
        { label: "Water resistance", value: "50 m, WR50" },
        { label: "Warranty", value: "1 year limited warranty" },
      ],
      variantAxes: axes,
      variants: buildVariants(axes, (selection) => {
        const [amount, mrp] = price[selection.size];
        return {
          price: amount,
          mrp,
          imageIndex: selection.colour === "black" ? 0 : 1,
        };
      }),
    };
  })(),

  (() => {
    const axes = [
      axis("size", "Case size", [
        { id: "40mm", label: "40 mm" },
        { id: "44mm", label: "44 mm" },
      ]),
      axis("colour", "Colour", [
        { id: "graphite", label: "Graphite", swatch: "#33353b" },
        { id: "cream", label: "Cream", swatch: "#e4dccf" },
      ]),
    ];
    const price: Record<string, [number, number]> = {
      "40mm": [32_999, 36_999],
      "44mm": [36_999, 40_999],
    };

    return {
      id: "galaxy-watch-8",
      slug: "galaxy-watch-8",
      name: "Galaxy Watch 8",
      brand: "Samsung",
      category: "wearables" as const,
      images: [
        `${IMG}/galaxy-watch-8-graphite.jpg`,
        `${IMG}/galaxy-watch-8-cream.jpg`,
      ],
      rating: 4.4,
      ratingCount: 3_506,
      highlights: [
        "Super AMOLED display at 3000 nits",
        "Energy Score and antioxidant index",
        "Dual-frequency GPS for accurate tracking",
        "Up to 40 hours with always-on display off",
      ],
      specs: [
        { label: "Display", value: "Super AMOLED, 3000 nits" },
        { label: "Processor", value: "Exynos W1000" },
        { label: "Battery", value: "435 mAh" },
        { label: "Sensors", value: "BioActive, ECG, BIA" },
        { label: "Water resistance", value: "5 ATM with IP68" },
        { label: "Warranty", value: "1 year manufacturer warranty" },
      ],
      variantAxes: axes,
      variants: buildVariants(axes, (selection) => {
        const [amount, mrp] = price[selection.size];
        return {
          price: amount,
          mrp,
          imageIndex: selection.colour === "graphite" ? 0 : 1,
        };
      }),
    };
  })(),

  (() => {
    const axes = [
      axis("size", "Screen size", [
        { id: "55in", label: "55 inch" },
        { id: "65in", label: "65 inch" },
      ]),
    ];
    const price: Record<string, [number, number]> = {
      "55in": [139_990, 179_990],
      "65in": [189_990, 239_990],
    };

    return {
      id: "samsung-oled-s90f",
      slug: "samsung-oled-s90f",
      name: "Samsung OLED S90F 4K TV",
      brand: "Samsung",
      category: "appliances" as const,
      images: [`${IMG}/samsung-oled-tv-55.jpg`],
      rating: 4.6,
      ratingCount: 1_842,
      highlights: [
        "4K OLED panel with 144Hz Motion Xcelerator",
        "NQ4 AI Gen2 processor with 4K upscaling",
        "Dolby Atmos with Object Tracking Sound",
        "Four HDMI 2.1 ports for console gaming",
      ],
      specs: [
        { label: "Panel", value: "OLED 4K, 3840 x 2160" },
        { label: "Refresh rate", value: "144 Hz" },
        { label: "Processor", value: "NQ4 AI Gen2" },
        { label: "Audio", value: "40 W, 2.1 channel" },
        { label: "Ports", value: "4 x HDMI 2.1, 3 x USB" },
        { label: "Warranty", value: "1 year comprehensive" },
      ],
      variantAxes: axes,
      variants: buildVariants(axes, (selection) => {
        const [amount, mrp] = price[selection.size];
        return { price: amount, mrp };
      }),
    };
  })(),
];
