(function () {
  const LOCALES = [
    "ko", "en", "ja", "zh-cn", "zh-tw", "es", "fr", "de", "pt-br",
    "hi", "ar", "ru", "id", "tr", "it", "vi", "th", "nl"
  ];
  const TOOL_SET = new Set(["roulette", "luckydraw", "ladder", "coinflip", "dice"]);

  const NOTES = {
    ko: {
      title: "랜덤은 이렇게 결정돼요",
      roulette: "룰렛의 실제 당첨 항목은 브라우저의 Web Crypto 난수로 균등 선택됩니다. 회전 애니메이션은 이미 정해진 결과를 보여주는 연출일 뿐, 당첨자 결정에는 영향을 주지 않습니다.",
      luckydraw: "번호/이름 추첨은 남아 있는 항목 중 하나를 브라우저의 Web Crypto 난수로 균등 선택합니다. 공이 움직이는 애니메이션은 선택된 결과를 보여주는 화면 효과입니다.",
      ladder: "사다리는 결과 라벨을 먼저 브라우저의 Web Crypto 난수로 섞은 뒤, 그 결과를 보여 줄 라우트를 생성합니다. 그래서 참가자 누구나 각 결과를 받을 확률이 동일합니다.",
      coinflip: "코인 던지기는 브라우저의 Web Crypto에서 나온 1비트 난수를 사용해 앞면/뒷면을 50:50으로 결정합니다. 코인 회전 애니메이션은 이미 정해진 결과를 보여주는 역할만 합니다.",
      dice: "주사위는 브라우저의 Web Crypto 난수를 사용하고, 1부터 6까지 각 면이 같은 확률이 되도록 편향 없는 정수 추출을 적용합니다. 3D 애니메이션은 결과 표시만 담당합니다."
    },
    en: {
      title: "How Randomness Works",
      roulette: "The actual winner is chosen uniformly with the browser Web Crypto API. The wheel spin animation only reveals that already-selected result and does not influence the winner.",
      luckydraw: "Each draw picks one remaining number or name uniformly with the browser Web Crypto API. The moving balls are only a visual effect for the selected result.",
      ladder: "The ladder first shuffles the result labels with the browser Web Crypto API, then builds routes to reveal that mapping. That keeps every participant equally likely to receive each result.",
      coinflip: "Each coin uses one random bit from the browser Web Crypto API, so heads and tails stay 50:50. The flip animation only reveals the result that was already decided.",
      dice: "Each die uses browser Web Crypto randomness with unbiased integer sampling so faces 1 through 6 stay equally likely. The 3D roll animation is visual only."
    },
    ja: {
      title: "乱数はこう決まります",
      roulette: "ルーレットの当選項目はブラウザの Web Crypto 乱数で均等に選ばれます。回転アニメーションは、すでに決まった結果を見せる演出であり、当選者の決定には影響しません。",
      luckydraw: "番号・名前の抽選は、残っている項目の中からブラウザの Web Crypto 乱数で均等に 1 つ選びます。ボールの動きは選ばれた結果を見せるための演出です。",
      ladder: "あみだくじは、結果ラベルを先にブラウザの Web Crypto 乱数でシャッフルし、その対応を見せるルートを生成します。これにより、各参加者が各結果を引く確率は同じになります。",
      coinflip: "コイン投げはブラウザの Web Crypto から得た 1 ビット乱数で表裏を 50:50 に決めます。回転アニメーションは、すでに決まった結果を表示するだけです。",
      dice: "サイコロはブラウザの Web Crypto 乱数を使い、1 から 6 までが同じ確率になるよう偏りのない整数抽選を行います。3D アニメーションは結果表示専用です。"
    },
    "zh-cn": {
      title: "随机性如何保证",
      roulette: "转盘的实际中奖项会通过浏览器的 Web Crypto 随机数进行等概率选择。旋转动画只负责展示已经选定的结果，不会影响中奖者。",
      luckydraw: "号码或姓名抽取时，会从剩余项目中通过浏览器的 Web Crypto 随机数等概率选出 1 个。小球动画只是展示已选中的结果。",
      ladder: "爬梯先用浏览器的 Web Crypto 随机数打乱结果标签，再生成用于展示该映射的路线，因此每位参与者拿到各结果的概率相同。",
      coinflip: "抛硬币使用浏览器 Web Crypto 产生的 1 位随机数来决定正反面，因此正面和反面保持 50:50。翻转动画只是展示已经确定的结果。",
      dice: "骰子使用浏览器 Web Crypto 随机数，并采用无偏整数抽取来保证 1 到 6 每一面概率相同。3D 动画只负责展示结果。"
    },
    "zh-tw": {
      title: "隨機性如何保證",
      roulette: "轉盤的實際中獎項目會透過瀏覽器的 Web Crypto 隨機數等機率選出。旋轉動畫只負責展示已經決定的結果，不會影響中獎者。",
      luckydraw: "號碼或姓名抽取時，會從剩餘項目中透過瀏覽器的 Web Crypto 隨機數等機率選出 1 個。球體動畫只是展示已選定的結果。",
      ladder: "爬梯先用瀏覽器的 Web Crypto 隨機數打亂結果標籤，再生成用來展示該對應的路線，因此每位參與者取得各結果的機率相同。",
      coinflip: "擲硬幣使用瀏覽器 Web Crypto 產生的 1 位隨機數來決定正反面，因此正面與反面保持 50:50。翻轉動畫只是在展示已經決定的結果。",
      dice: "骰子使用瀏覽器 Web Crypto 隨機數，並以無偏整數抽樣保證 1 到 6 每一面的機率相同。3D 動畫只負責顯示結果。"
    },
    es: {
      title: "Como se garantiza el azar",
      roulette: "El ganador real se elige de forma uniforme con Web Crypto del navegador. La animacion de la ruleta solo muestra ese resultado ya decidido y no influye en el ganador.",
      luckydraw: "Cada sorteo elige de forma uniforme uno de los elementos restantes con Web Crypto del navegador. Las bolas en movimiento son solo un efecto visual del resultado elegido.",
      ladder: "La escalera mezcla primero las etiquetas de resultado con Web Crypto del navegador y despues genera las rutas para mostrar ese mapeo. Asi, cada participante tiene la misma probabilidad de recibir cada resultado.",
      coinflip: "Cada moneda usa un bit aleatorio de Web Crypto del navegador, por lo que cara y cruz se mantienen en 50:50. La animacion del giro solo revela el resultado ya decidido.",
      dice: "Cada dado usa Web Crypto del navegador con muestreo entero sin sesgo para que las caras del 1 al 6 tengan la misma probabilidad. La animacion 3D es solo visual."
    },
    fr: {
      title: "Comment le hasard est garanti",
      roulette: "Le gagnant reel est choisi uniformement avec Web Crypto du navigateur. L animation de la roue ne fait qu afficher ce resultat deja decide et n influence pas le gagnant.",
      luckydraw: "Chaque tirage choisit uniformement un numero ou un nom restant avec Web Crypto du navigateur. Les boules en mouvement ne sont qu un effet visuel du resultat selectionne.",
      ladder: "Le jeu d echelle melange d abord les etiquettes de resultat avec Web Crypto du navigateur, puis genere les parcours pour afficher cette correspondance. Ainsi, chaque participant a la meme probabilite d obtenir chaque resultat.",
      coinflip: "Chaque piece utilise un bit aleatoire issu de Web Crypto du navigateur, donc pile et face restent a 50:50. L animation ne fait que reveler le resultat deja decide.",
      dice: "Chaque de utilise le hasard Web Crypto du navigateur avec un tirage entier sans biais afin que les faces 1 a 6 aient la meme probabilite. L animation 3D est uniquement visuelle."
    },
    de: {
      title: "So wird die Zufallsauswahl gesichert",
      roulette: "Der eigentliche Gewinner wird gleichverteilt mit der Web-Crypto-API des Browsers bestimmt. Die Drehanimation zeigt nur dieses bereits feststehende Ergebnis und beeinflusst den Gewinner nicht.",
      luckydraw: "Jede Ziehung waehlt gleichverteilt einen verbleibenden Namen oder eine Zahl mit der Web-Crypto-API des Browsers aus. Die bewegten Kugeln sind nur ein visueller Effekt fuer das ausgewaehlte Ergebnis.",
      ladder: "Das Leiterspiel mischt zuerst die Ergebnislabels mit der Web-Crypto-API des Browsers und erzeugt danach die Routen fuer diese Zuordnung. So hat jede Person die gleiche Wahrscheinlichkeit fuer jedes Ergebnis.",
      coinflip: "Jede Muenze nutzt ein Zufallsbit aus der Web-Crypto-API des Browsers, deshalb bleiben Kopf und Zahl bei 50:50. Die Wurfanimation zeigt nur das bereits entschiedene Ergebnis an.",
      dice: "Jeder Wuerfel nutzt Browser-Web-Crypto mit unverzerrter Ganzzahlziehung, damit die Seiten 1 bis 6 gleich wahrscheinlich bleiben. Die 3D-Animation dient nur zur Anzeige."
    },
    "pt-br": {
      title: "Como a aleatoriedade e garantida",
      roulette: "O vencedor real e escolhido de forma uniforme com Web Crypto do navegador. A animacao da roleta apenas revela esse resultado ja decidido e nao influencia o vencedor.",
      luckydraw: "Cada sorteio escolhe de forma uniforme um numero ou nome restante com Web Crypto do navegador. As bolas em movimento sao apenas um efeito visual do resultado selecionado.",
      ladder: "A escada primeiro embaralha os rotulos de resultado com Web Crypto do navegador e depois gera os caminhos para mostrar esse mapeamento. Assim, cada participante tem a mesma chance de receber cada resultado.",
      coinflip: "Cada moeda usa um bit aleatorio vindo do Web Crypto do navegador, entao cara e coroa permanecem em 50:50. A animacao do giro apenas revela o resultado ja definido.",
      dice: "Cada dado usa Web Crypto do navegador com amostragem inteira sem vies para que as faces de 1 a 6 tenham a mesma probabilidade. A animacao 3D e apenas visual."
    },
    hi: {
      title: "यादृच्छिकता ऐसे तय होती है",
      roulette: "रूलेट का असली विजेता ब्राउज़र के Web Crypto रैंडम स्रोत से समान संभावना के साथ चुना जाता है। घूमने वाली एनीमेशन सिर्फ पहले से तय परिणाम दिखाती है और विजेता पर असर नहीं डालती।",
      luckydraw: "हर ड्रॉ में बचे हुए नाम या नंबरों में से एक को ब्राउज़र के Web Crypto रैंडम स्रोत से समान संभावना के साथ चुना जाता है। गेंदों की एनीमेशन सिर्फ चुने गए परिणाम को दिखाती है।",
      ladder: "सीढ़ी खेल पहले ब्राउज़र के Web Crypto रैंडम स्रोत से परिणाम लेबल को शफल करता है, फिर उसी मैपिंग को दिखाने के लिए रास्ते बनाता है। इसलिए हर प्रतिभागी के लिए हर परिणाम की संभावना समान रहती है।",
      coinflip: "हर सिक्का ब्राउज़र के Web Crypto से निकले 1 रैंडम बिट का उपयोग करता है, इसलिए हेड और टेल 50:50 रहते हैं। फ्लिप एनीमेशन सिर्फ पहले से तय परिणाम दिखाती है।",
      dice: "हर पासा ब्राउज़र Web Crypto रैंडमनेस और बिना पक्षपात वाले पूर्णांक चयन का उपयोग करता है, इसलिए 1 से 6 तक हर फेस की संभावना समान रहती है। 3D एनीमेशन सिर्फ दृश्य प्रभाव है।"
    },
    ar: {
      title: "كيف نضمن العشوائية",
      roulette: "يتم اختيار الفائز الفعلي بالتساوي باستخدام Web Crypto في المتصفح. دوران العجلة مجرد عرض بصري للنتيجة التي تم تحديدها مسبقا ولا يؤثر في الفائز.",
      luckydraw: "كل سحب يختار اسما او رقما متبقيا بشكل متساو باستخدام Web Crypto في المتصفح. حركة الكرات مجرد تأثير بصري للنتيجة المختارة.",
      ladder: "تقوم لعبة السلم اولا بخلط تسميات النتائج باستخدام Web Crypto في المتصفح ثم تبني المسارات لعرض هذا التوزيع. لذلك تكون فرصة كل مشارك متساوية للحصول على كل نتيجة.",
      coinflip: "كل قطعة تستخدم بتا عشوائيا واحدا من Web Crypto في المتصفح، لذلك تبقى فرصتا الوجه والظهر 50:50. حركة الدوران مجرد عرض للنتيجة المحددة مسبقا.",
      dice: "كل نرد يستخدم عشوائية Web Crypto في المتصفح مع سحب اعداد صحيحة بدون تحيز، لذلك تبقى الوجوه من 1 الى 6 متساوية الاحتمال. الرسوم ثلاثية الابعاد للعرض فقط."
    },
    ru: {
      title: "Как обеспечивается случайность",
      roulette: "Победитель выбирается равновероятно с помощью Web Crypto в браузере. Анимация вращения только показывает уже выбранный результат и не влияет на победителя.",
      luckydraw: "Каждый розыгрыш равновероятно выбирает одно оставшееся имя или число с помощью Web Crypto в браузере. Движение шаров является только визуальным эффектом выбранного результата.",
      ladder: "Лестница сначала перемешивает метки результатов с помощью Web Crypto в браузере, а затем строит маршруты для показа этого соответствия. Поэтому у каждого участника одинаковая вероятность получить любой результат.",
      coinflip: "Каждая монета использует один случайный бит из Web Crypto в браузере, поэтому орел и решка остаются 50:50. Анимация подбрасывания лишь показывает уже определенный результат.",
      dice: "Каждый кубик использует Web Crypto в браузере и выбор целого числа без смещения, поэтому грани от 1 до 6 остаются равновероятными. 3D-анимация служит только для показа."
    },
    id: {
      title: "Bagaimana acaknya dijaga",
      roulette: "Pemenang asli dipilih secara merata dengan Web Crypto di browser. Animasi putaran roda hanya menampilkan hasil yang sudah ditentukan dan tidak memengaruhi pemenang.",
      luckydraw: "Setiap undian memilih satu nama atau angka yang tersisa secara merata dengan Web Crypto di browser. Gerakan bola hanya efek visual untuk hasil yang terpilih.",
      ladder: "Permainan tangga lebih dulu mengacak label hasil dengan Web Crypto di browser, lalu membuat rute untuk menampilkan pemetaan itu. Dengan begitu, setiap peserta punya peluang yang sama untuk setiap hasil.",
      coinflip: "Setiap koin memakai satu bit acak dari Web Crypto di browser, jadi sisi head dan tail tetap 50:50. Animasi lemparan hanya menampilkan hasil yang sudah diputuskan.",
      dice: "Setiap dadu memakai Web Crypto di browser dengan pengambilan bilangan bulat tanpa bias, sehingga angka 1 sampai 6 tetap memiliki peluang yang sama. Animasi 3D hanya untuk tampilan."
    },
    tr: {
      title: "Rastgelelik nasil saglaniyor",
      roulette: "Gercek kazanan tarayicidaki Web Crypto ile esit olasilikla secilir. Donus animasyonu sadece onceden belirlenen sonucu gosterir ve kazananı etkilemez.",
      luckydraw: "Her cekilis kalan ad veya sayilardan birini tarayicidaki Web Crypto ile esit olasilikla secer. Hareket eden toplar sadece secilen sonucu gosteren gorsel bir efektir.",
      ladder: "Merdiven oyunu once sonuc etiketlerini tarayicidaki Web Crypto ile karistirir, sonra bu eslesmeyi gosterecek rotalari olusturur. Boylece her katilimci her sonuc icin ayni olasiliga sahip olur.",
      coinflip: "Her para tarayicidaki Web Crypto'dan gelen tek bir rastgele biti kullanir; bu nedenle yazi ve tura 50:50 kalir. Atilis animasyonu sadece onceden belirlenen sonucu gosterir.",
      dice: "Her zar, tarayici Web Crypto rastgeleligi ve yanlisiz tamsayi orneklemesi kullanir; boylece 1 ile 6 arasindaki tum yuzler esit olasilikli kalir. 3D animasyon sadece gorseldir."
    },
    it: {
      title: "Come viene garantita la casualita",
      roulette: "Il vincitore reale viene scelto in modo uniforme con Web Crypto del browser. L animazione della ruota mostra solo quel risultato gia deciso e non influenza il vincitore.",
      luckydraw: "Ogni estrazione sceglie in modo uniforme un nome o numero rimanente con Web Crypto del browser. Il movimento delle palline e solo un effetto visivo del risultato selezionato.",
      ladder: "Il gioco della scala mescola prima le etichette dei risultati con Web Crypto del browser e poi genera i percorsi per mostrare quell abbinamento. Cosi ogni partecipante ha la stessa probabilita di ricevere ogni risultato.",
      coinflip: "Ogni moneta usa un bit casuale di Web Crypto del browser, quindi testa e croce restano 50:50. L animazione del lancio mostra solo il risultato gia deciso.",
      dice: "Ogni dado usa la casualita Web Crypto del browser con estrazione intera senza bias, cosi le facce da 1 a 6 restano equiprobabili. L animazione 3D e solo visiva."
    },
    vi: {
      title: "Do ngau nhien duoc dam bao the nao",
      roulette: "Nguoi thang thuc te duoc chon dong deu bang Web Crypto cua trinh duyet. Hieu ung quay chi hien thi ket qua da duoc chon san va khong anh huong den nguoi thang.",
      luckydraw: "Moi lan rut se chon dong deu mot ten hoac con so con lai bang Web Crypto cua trinh duyet. Chuyen dong cua cac bong chi la hieu ung hien thi ket qua da duoc chon.",
      ladder: "Tro choi thang truoc tien tron cac nhan ket qua bang Web Crypto cua trinh duyet, sau do tao duong di de hien thi anh xa do. Nho vay, moi nguoi tham gia deu co xac suat nhu nhau cho tung ket qua.",
      coinflip: "Moi dong xu su dung 1 bit ngau nhien tu Web Crypto cua trinh duyet, vi vay mat ngua va mat sap giu ty le 50:50. Hieu ung tung dong xu chi hien thi ket qua da quyet dinh.",
      dice: "Moi xuc xac su dung Web Crypto cua trinh duyet cung voi cach lay so nguyen khong lech, nen cac mat tu 1 den 6 co cung xac suat. Hieu ung 3D chi de hien thi."
    },
    th: {
      title: "ระบบสุ่มทำงานอย่างไร",
      roulette: "ผู้ชนะจริงถูกเลือกแบบโอกาสเท่ากันด้วย Web Crypto ของเบราว์เซอร์ ส่วนแอนิเมชันวงล้อมีหน้าที่แค่แสดงผลที่ถูกเลือกไว้แล้วและไม่กระทบผู้ชนะ",
      luckydraw: "แต่ละครั้งจะสุ่มเลือกชื่อหรือตัวเลขที่ยังเหลืออยู่แบบโอกาสเท่ากันด้วย Web Crypto ของเบราว์เซอร์ การเคลื่อนไหวของลูกบอลเป็นเพียงเอฟเฟกต์แสดงผลลัพธ์ที่ถูกเลือก",
      ladder: "เกมบันไดจะสลับป้ายผลลัพธ์ด้วย Web Crypto ของเบราว์เซอร์ก่อน แล้วค่อยสร้างเส้นทางเพื่อแสดงการจับคู่นั้น ดังนั้นผู้เล่นทุกคนจึงมีโอกาสได้ผลลัพธ์แต่ละแบบเท่ากัน",
      coinflip: "เหรียญแต่ละอันใช้บิตสุ่ม 1 บิตจาก Web Crypto ของเบราว์เซอร์ จึงทำให้หัวและก้อยเป็น 50:50 แอนิเมชันการหมุนมีหน้าที่เพียงแสดงผลที่ถูกตัดสินไว้แล้ว",
      dice: "ลูกเต๋าแต่ละลูกใช้ Web Crypto ของเบราว์เซอร์ร่วมกับการสุ่มจำนวนเต็มแบบไร้อคติ จึงทำให้หน้า 1 ถึง 6 มีโอกาสเท่ากัน แอนิเมชัน 3D มีไว้เพื่อแสดงผลเท่านั้น"
    },
    nl: {
      title: "Hoe de willekeur wordt bewaakt",
      roulette: "De echte winnaar wordt gelijkmatig gekozen met Web Crypto van de browser. De draai-animatie laat alleen dat al gekozen resultaat zien en heeft geen invloed op de winnaar.",
      luckydraw: "Elke trekking kiest gelijkmatig een overgebleven naam of nummer met Web Crypto van de browser. De bewegende ballen zijn alleen een visueel effect van het gekozen resultaat.",
      ladder: "Het ladderspel schudt eerst de resultaatlabels met Web Crypto van de browser en bouwt daarna de routes om die koppeling te tonen. Zo heeft iedere deelnemer dezelfde kans op ieder resultaat.",
      coinflip: "Elke munt gebruikt een willekeurige bit uit Web Crypto van de browser, waardoor kop en munt 50:50 blijven. De flip-animatie toont alleen het resultaat dat al vaststond.",
      dice: "Elke dobbelsteen gebruikt browser-Web Crypto met onbevooroordeelde gehele sampling, zodat de vlakken 1 tot en met 6 even waarschijnlijk blijven. De 3D-animatie is alleen visueel."
    }
  };

  function detectLocale() {
    const htmlLang = String(document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (LOCALES.includes(htmlLang)) return htmlLang;
    const match = window.location.pathname.match(/^\/(?:(ko|en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl)\/)?/i);
    return match && match[1] ? match[1].toLowerCase() : "ko";
  }

  function detectTool() {
    const match = window.location.pathname.match(/\/(roulette|luckydraw|ladder|coinflip|dice)\/?$/i);
    return match && match[1] ? match[1].toLowerCase() : "";
  }

  function buildSection(copy, locale, tool) {
    const section = document.createElement("section");
    section.className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16";
    section.setAttribute("data-rlt-randomness-note", `${tool}:${locale}`);
    section.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-3">
        <h2 class="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">${copy.title}</h2>
        <p class="text-sm md:text-base text-slate-600">${copy[tool]}</p>
      </div>
    `;
    return section;
  }

  function injectNote() {
    const tool = detectTool();
    if (!TOOL_SET.has(tool)) return;
    if (document.querySelector("[data-rlt-randomness-note]")) return;
    const locale = detectLocale();
    const copy = NOTES[locale] || NOTES.en;
    if (!copy || !copy[tool]) return;
    const main = document.querySelector("main");
    if (!main) return;
    main.appendChild(buildSection(copy, locale, tool));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectNote, { once: true });
  } else {
    injectNote();
  }
})();
