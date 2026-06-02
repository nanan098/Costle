import type { Attempt } from "../types";
import { directionalLabel } from "../components/directionalLabel";
import { toPng } from "html-to-image";

const getResultImageBlob = async (
  resultElement: HTMLElement,
): Promise<Blob | null> => {
  const dataUrl = await toPng(resultElement, {
    cacheBust: true,
    backgroundColor: "#ffffff",
  });

  const response = await fetch(dataUrl);
  return await response.blob();
};

export const handleShare = async (
  attempts: Attempt[],
  name?: string,
  resultElement?: HTMLElement | null,
) => {
  const lines = attempts.map((a, index) => {
    const shotNumber = attempts.length - index;
    return `${shotNumber}. ${a.price.toFixed(2)} zł — ${directionalLabel(a).label}`;
  });
  const text = `Moje strzały:\n${lines.join("\n")}`;
  const formattedName = name?.trim() || "gra";

  let imageBlob: Blob | null = null;

  try {
    if (resultElement) {
      imageBlob = await getResultImageBlob(resultElement);
    }

    if (imageBlob) {
      const filename = `wynik-${formattedName.replace(/\s+/g, "_")}.png`;
      const file = new File([imageBlob], filename, { type: "image/png" });

      if ((navigator as any).canShare?.({ files: [file] })) {
        try {
          await (navigator as any).share({
            files: [file],
            title: "Mój wynik w grze",
            text,
          });
          return;
        } catch (err) {
          console.error("Udostępnianie obrazu nie powiodło się:", err);
        }
      }

      try {
        if ((navigator as any).clipboard?.write) {
          const ClipboardItemCtor = (window as any).ClipboardItem;
          if (ClipboardItemCtor) {
            const clipboardItem = new ClipboardItemCtor({
              ["image/png"]: imageBlob,
            });
            await (navigator as any).clipboard.write([clipboardItem]);
            window.alert(
              "Obraz skopiowany do schowka. Wklej w miejscu docelowym (Ctrl+V).",
            );
            return;
          }
        }
      } catch (err) {
        console.error("Kopiowanie obrazu do schowka nie powiodło się:", err);
      }

      try {
        const url = URL.createObjectURL(imageBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        window.alert(
          "Obraz pobrany. Możesz teraz przesłać go do Discorda/Facebooka.",
        );
        return;
      } catch (err) {
        console.error("Pobieranie obrazu nie powiodło się:", err);
      }
    }

    if ((navigator as any).share) {
      await (navigator as any).share({ title: "Mój wynik w grze", text });
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      window.alert("Wynik skopiowany do schowka");
    } else {
      window.alert(text);
    }
  } catch (err) {
    console.error("Błąd udostępniania:", err);
  }
};
