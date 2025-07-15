import React, { useEffect, useRef, useState } from "react";

// --- Tür Tanımları -----------------------------------------------------------
interface Hayvan {
  id: number;
  tur: Tur;
  cinsiyet: Cinsiyet;
  x: number;
  y: number;
  hiz: number;
}

type Tur =
  | "koyun"
  | "inek"
  | "tavuk"
  | "horoz"
  | "kurt"
  | "aslan"
  | "avci";

type Cinsiyet = "E" | "D" | "Y"; // Y = cinsiyetsiz (geçersiz)

// Her tür için E, D veya Y alanları isteğe bağlı
interface CinsiyetliSayilar {
  [tur: string]: { E?: number; D?: number; Y?: number };
}

// --- Sabitler ---------------------------------------------------------------
const GENISLIK = 500;
const YUKSEKLIK = 500;
const ADIM_SINIRI = 1000;

const HIZ: Record<Tur, number> = {
  koyun: 2,
  inek: 2,
  tavuk: 1,
  horoz: 1,
  kurt: 3,
  aslan: 4,
  avci: 1,
};

const RENKLER: Record<Tur, string> = {
  koyun: "#b5e48c",
  inek: "#ffd166",
  tavuk: "#f8f9fa",
  horoz: "#ff006e",
  kurt: "#6d6875",
  aslan: "#ffb703",
  avci: "#023047",
};

const RENK_EMOJISI: Record<Tur, string> = {
  koyun: "🟢",
  inek: "🟡",
  tavuk: "⚪",
  horoz: "🔴",
  kurt: "⚫",
  aslan: "🟠",
  avci: "🔵",
};

const YARICAP = 2;

// --- Yardımcı Fonksiyonlar ---------------------------------------------------
const uzaklik = (a: Hayvan, b: Hayvan) => Math.hypot(a.x - b.x, a.y - b.y);
const rastgeleKonum = () => Math.random() * 500;
let idSayaci = 0;
const siradakiId = () => ++idSayaci;

// --- Başlangıç Popülasyonu ---------------------------------------------------
function baslangicHayvanlariOlustur(sayilar: CinsiyetliSayilar): Hayvan[] {
  const hayvanlar: Hayvan[] = [];

  const ekle = (tur: Tur, cinsiyet: Cinsiyet, adet: number) => {
    for (let i = 0; i < adet; i++) {
      hayvanlar.push({
        id: siradakiId(),
        tur,
        cinsiyet,
        x: rastgeleKonum(),
        y: rastgeleKonum(),
        hiz: HIZ[tur],
      });
    }
  };

  (Object.entries(sayilar) as [Tur, { E?: number; D?: number; Y?: number }][])
    .forEach(([tur, c]) => {
      if (c.Y !== undefined) {
        ekle(tur, "Y", c.Y);
      } else {
        ekle(tur, "E", c.E ?? 0);
        ekle(tur, "D", c.D ?? 0);
      }
    });

  return hayvanlar;
}

// --- Ana Bileşen -------------------------------------------------------------
export default function HayvanatBahcesiSimulasyonu() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [sayilarInput, setSayilarInput] = useState<CinsiyetliSayilar>({
    koyun: { E: 15, D: 15 },
    inek: { E: 5, D: 5 },
    kurt: { E: 5, D: 5 },
    aslan: { E: 4, D: 4 },
    tavuk: { Y: 10 },
    horoz: { Y: 10 },
    avci: { Y: 1 },
  });

  const [hayvanlar, setHayvanlar] = useState<Hayvan[]>([]);
  const [adim, setAdim] = useState(0);
  const [calisiyor, setCalisiyor] = useState(false);

  // Simülasyonu ilerlet
  useEffect(() => {
    if (!calisiyor) return;
    const interval = setInterval(() => {
      setHayvanlar((onceki) => simulasyonAdimi(onceki));
      setAdim((a) => a + 1);
    }, 30);

    return () => clearInterval(interval);
  }, [calisiyor]);

  // Canvas çizimi
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, GENISLIK, YUKSEKLIK);
    hayvanlar.forEach((a) => {
      ctx.fillStyle = RENKLER[a.tur];
      ctx.beginPath();
      ctx.arc(a.x, a.y, YARICAP, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [hayvanlar]);

  useEffect(() => {
    if (adim >= ADIM_SINIRI && calisiyor) setCalisiyor(false);
  }, [adim, calisiyor]);

  // Anlık popülasyon sayıları (ekranda gösteriyoruz)
  const sayilar = hayvanlar.reduce<Record<Tur, number>>(
    (acc, a) => {
      acc[a.tur] = (acc[a.tur] || 0) + 1;
      return acc;
    },
    {
      koyun: 0,
      inek: 0,
      tavuk: 0,
      horoz: 0,
      kurt: 0,
      aslan: 0,
      avci: 0,
    }
  );

  // Değer güncelleme yardımcıları
  const handleDegis = (
    tur: Tur,
    alan: "E" | "D" | "Y",
    value: number
  ) => {
    setSayilarInput((prev) => ({
      ...prev,
      [tur]: { ...prev[tur], [alan]: value },
    }));
  };

  const CINSIYETLI_TURLER: Tur[] = ["koyun", "inek", "kurt", "aslan"];
  const Y_TURLER: Tur[] = ["tavuk", "horoz", "avci"];

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Hayvanat Bahçesi Simülasyonu</h1>

      <canvas
        ref={canvasRef}
        width={GENISLIK}
        height={YUKSEKLIK}
        className="border border-gray-400 bg-white"
      />

      {/* --- Giriş Formu ---------------------------------------------------- */}
      <div className="grid grid-cols-3 gap-4 mb-4">

        {/* Erkek / Dişi ile kontrol edilen türler */}
        {CINSIYETLI_TURLER.map((tur) => (
          <div key={tur} className="border p-4 rounded shadow bg-gray-100">
            <h2 className="text-lg font-bold capitalize mb-2">
              {RENK_EMOJISI[tur]} {tur}
            </h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm">
                Erkek:
                <input
                  type="number"
                  min={0}
                  value={sayilarInput[tur].E}
                  onChange={(e) =>
                    handleDegis(tur, "E", parseInt(e.target.value || "0"))
                  }
                  className="w-full border p-1 rounded"
                />
              </label>
              <label className="text-sm">
                Dişi:
                <input
                  type="number"
                  min={0}
                  value={sayilarInput[tur].D}
                  onChange={(e) =>
                    handleDegis(tur, "D", parseInt(e.target.value || "0"))
                  }
                  className="w-full border p-1 rounded"
                />
              </label>
            </div>
          </div>
        ))}

        {/* Y cinsiyetli türler */}
        {Y_TURLER.map((tur) => (
          <div key={tur} className="border p-4 rounded shadow bg-gray-100">
            <h2 className="text-lg font-bold capitalize mb-2">
              {RENK_EMOJISI[tur]} {tur}
            </h2>
            <label className="text-sm">
              Adet:
              <input
                type="number"
                min={0}
                value={sayilarInput[tur].Y}
                onChange={(e) =>
                  handleDegis(tur, "Y", parseInt(e.target.value || "0"))
                }
                className="w-full border p-1 rounded"
              />
            </label>
          </div>
        ))}
      </div>

      {/* --- Kontrol Düğmeleri ------------------------------------------- */}
      <div className="flex gap-4">
        <button
          className="px-4 py-2 rounded-lg bg-green-500 text-white shadow disabled:opacity-40"
          onClick={() => {
            setHayvanlar(baslangicHayvanlariOlustur(sayilarInput));
            setAdim(0);
            setCalisiyor(true);
          }}
          disabled={calisiyor || adim >= ADIM_SINIRI}
        >
          Başlat
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-red-500 text-white shadow disabled:opacity-40"
          onClick={() => setCalisiyor(false)}
          disabled={!calisiyor}
        >
          Durdur
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-yellow-500 text-white shadow"
          onClick={() => {
            setHayvanlar([]);
            setAdim(0);
            setCalisiyor(false);
          }}
        >
          Sıfırla
        </button>
      </div>

      {/* --- Canlı Sayılar ------------------------------------------------- */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {Object.entries(sayilar).map(([tur, sayi]) => (
          <div
            key={tur}
            className="p-2 rounded-lg bg-gray-100 shadow flex items-center justify-center gap-2"
          >
            <span
              className="w-4 h-4 rounded-full inline-block"
              style={{ backgroundColor: RENKLER[tur as Tur] }}
            />
            <span className="font-semibold capitalize">
              {RENK_EMOJISI[tur as Tur]} {tur}
            </span>
            : {sayi}
          </div>
        ))}
      </div>

      <p className="mt-2 text-sm text-gray-600">Toplam Adım: {adim}</p>
    </div>
  );
}

// --- Simülasyon Mantığı ------------------------------------------------------
function simulasyonAdimi(oncekiHayvanlar: Hayvan[]): Hayvan[] {
  const hareketEdenler = oncekiHayvanlar.map((a) => hayvaniHareketEttir(a));
  const hayattaKalanlar = avlanmayiIsle(hareketEdenler);
  const yavrular = uremeyiIsle(hayattaKalanlar);
  return yavrular;
}

function hayvaniHareketEttir(a: Hayvan): Hayvan {
  const aci = Math.random() * Math.PI * 2;
  const dx = Math.cos(aci) * a.hiz;
  const dy = Math.sin(aci) * a.hiz;
  return {
    ...a,
    x: sinirla(a.x + dx, 0, GENISLIK),
    y: sinirla(a.y + dy, 0, YUKSEKLIK),
  };
}

function sinirla(deger: number, min: number, max: number) {
  return Math.max(min, Math.min(max, deger));
}

function avlanmayiIsle(hayvanlar: Hayvan[]): Hayvan[] {
  const yasayanlar = new Set<number>();
  hayvanlar.forEach((a) => yasayanlar.add(a.id));

  hayvanlar.forEach((avci) => {
    if (!yasayanlar.has(avci.id)) return;
    switch (avci.tur) {
      case "kurt":
        hayvanlar.forEach((av) => {
          if (
            yasayanlar.has(av.id) &&
            ["koyun", "tavuk", "horoz"].includes(av.tur) &&
            uzaklik(avci, av) <= 4
          )
            yasayanlar.delete(av.id);
        });
        break;
      case "aslan":
        hayvanlar.forEach((av) => {
          if (
            yasayanlar.has(av.id) &&
            ["inek", "koyun"].includes(av.tur) &&
            uzaklik(avci, av) <= 5
          )
            yasayanlar.delete(av.id);
        });
        break;
      case "avci":
        hayvanlar.forEach((av) => {
          if (
            av.id !== avci.id &&
            yasayanlar.has(av.id) &&
            uzaklik(avci, av) <= 8
          )
            yasayanlar.delete(av.id);
        });
        break;
    }
  });

  return hayvanlar.filter((a) => yasayanlar.has(a.id));
}

function uremeyiIsle(hayvanlar: Hayvan[]): Hayvan[] {
  const doganlar: Hayvan[] = [];
  const eslesenler = new Set<number>();

  for (let i = 0; i < hayvanlar.length; i++) {
    const a = hayvanlar[i];
    if (eslesenler.has(a.id) || a.cinsiyet === "Y") continue;

    for (let j = i + 1; j < hayvanlar.length; j++) {
      const b = hayvanlar[j];
      if (
        a.tur === b.tur &&
        a.cinsiyet !== b.cinsiyet &&
        !eslesenler.has(b.id) &&
        uzaklik(a, b) <= 3
      ) {
        eslesenler.add(a.id);
        eslesenler.add(b.id);

        const toplam = hayvanlar.filter((x) => x.tur === a.tur).length;
        if (toplam < 1000) {
          doganlar.push({
            id: siradakiId(),
            tur: a.tur,
            cinsiyet: Math.random() < 0.5 ? "E" : "D",
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2,
            hiz: a.hiz,
          });
        }
        break;
      }
    }
  }

  return [...hayvanlar, ...doganlar];
}
