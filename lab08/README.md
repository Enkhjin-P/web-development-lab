# Лаб 8. Bootstrap ба Tailwind CSS

Лаб 6-гийн Brew & Bean фото цомгийн хуудсыг (navbar, hero, зургийн цомог, эргэдэг цэс, видео, газрын зураг, sidebar, footer) хоёр удаа бүтээсэн. Лаб 6-д form байгаагүй тул form validation-тай "Санал хүсэлт" хэсгийг шинээр нэмсэн.

- `bootstrap/index.html` — Bootstrap 5.3.3 (CDN). `custom.css` дотор `.btn-brand`, `app.js` дотор dark mode, цэс, form validation
- `tailwind/index.html` — Tailwind v4. `tailwind/src/input.css` дотор `@custom-variant`, `@theme`; build хийсэн `tailwind/dist/output.css`
- `img/`, `video/` — Лаб 6-гийн зураг, видео (хоёр хуудсанд нийтлэг)
- `tools/` — хэмжилтийн скриптүүд (`server.js`, `test.py`, `lh.mjs`)

Нээх: VS Code-ийн Live Server-ээр хавтасны язгуурыг ажиллуулаад `/bootstrap/index.html`, `/tailwind/index.html` хаягаар орно (Bootstrap-д интернет хэрэгтэй, CDN-ээс ачаална).

Tailwind-ийг дахин build хийх:

    npm install
    npm run build


## Хэмжилт ба дүгнэлт

| Үзүүлэлт | Bootstrap | Tailwind |
|---|---|---|
| Өөрийн CSS | 5.4 KB (`custom.css`) + CDN-ийн Bootstrap | 24.7 KB (`dist/output.css`) |
| HTML | 17.2 KB | 23.8 KB |
| JS (`app.js`) | 2.2 KB | 2.4 KB |
| Нэг зургийн card-ын class тоо | 12 | 30 |
| Lighthouse Performance | 87 | 80 |
| Accessibility / Best Practices / SEO | 100 / 100 / 100 | 100 / 100 / 100 |
| FCP | 1204 ms | 903 ms |
| LCP | 3982 ms | 5329 ms |
| TBT / CLS | 0 ms / 0 | 0 ms / 0 |
| Нийт ачаалсан хэмжээ | 1189 KB | 1140 KB |

Bootstrap-ийн card бэлэн component class-тай тул нэг card-ын markup хамаагүй богино (12 class, Tailwind-д 30), харин Tailwind-д utility class бүгд HTML дотор бичигдэх тул HTML ойролцоогоор 38% их (23.8 KB, Bootstrap-д 17.2 KB) боловч build хийсэн CSS зөвхөн ашигласан class-уудыг агуулдаг учраас нийт ачаалсан хэмжээ бага зэрэг бага (1140 KB, Bootstrap-д 1189 KB) бөгөөд FCP илүү хурдан (903 ms, Bootstrap-д 1204 ms). Гэсэн хэдий ч LCP Tailwind-д удаан (5329 ms, Bootstrap-д 3982 ms) учир Performance оноо Bootstrap-д өндөр (87, Tailwind-д 80); энэ зөрүүний шалтгааныг би тусад нь шалгаагүй. Accessibility, Best Practices, SEO гурав хоёуланд нь 100, TBT 0 ms, CLS 0 тул чанарын хувьд ялгаа гараагүй. Дүгнэж хэлбэл, хурдан бөгөөд цөөн markup-аар бэлэн загвар хийхэд Bootstrap тохиромжтой, харин жижиг CSS болон загварыг нарийн хянахад Tailwind давуу боловч HTML урт, class олонтой болдог. (Хэмжилтийг локал серверээр, хоёр хуудсанд ижил нөхцөлд, 5 удаа хийж медиан авсан.)

Хэмжих: `node tools/server.js`, дараа нь өөр терминалд `node tools/lh.mjs`.
