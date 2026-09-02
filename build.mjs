import { mkdir, rm, writeFile, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = new URL(".", import.meta.url).pathname;
const out = join(root, "dist");
const origin = "https://bigpoker.ru";
const today = "2026-08-26";

const oldPages = [
  ["acrpoker-download", "Скачать ACR Poker: версия для компьютера и мобильных устройств", "Разбираем варианты установки клиента ACR Poker, системные требования и базовую проверку файла перед запуском.", "Установка клиента", ["Выбирайте загрузку только с сайта оператора и проверяйте адрес страницы перед скачиванием.", "После установки обновите приложение до последней версии и включите двухфакторную защиту аккаунта.", "Доступность приложения и отдельных функций зависит от страны пользователя."]],
  ["acrpoker-registration", "Регистрация в ACR Poker: основные этапы", "Пошаговый обзор создания аккаунта, подтверждения данных и настройки безопасности профиля.", "Создание аккаунта", ["Указывайте достоверные данные: они могут потребоваться при проверке личности и выводе средств.", "Используйте уникальный пароль и не передавайте коды подтверждения третьим лицам.", "До регистрации проверьте возрастные и территориальные ограничения."]],
  ["acrpoker-login", "Вход в ACR Poker и защита аккаунта", "Что проверить, если приложение не принимает данные, и как снизить риск потери доступа к профилю.", "Безопасный вход", ["Проверьте раскладку клавиатуры, соединение и актуальность версии клиента.", "Не вводите пароль на страницах, полученных из случайной рекламы или сообщений.", "Для восстановления доступа используйте только официальную поддержку оператора."]],
  ["acrpoker-deposit", "Внесение депозита в ACR Poker", "Обзор логики пополнения баланса, комиссий, лимитов и сроков обработки платежей.", "Пополнение баланса", ["Доступные методы, комиссии и лимиты отображаются непосредственно в кассе аккаунта.", "Имя владельца платёжного средства должно соответствовать данным профиля.", "Сохраняйте подтверждение операции до зачисления средств."]],
  ["acrpoker-withdrawal", "Вывод средств из ACR Poker", "Что влияет на сроки обработки заявки и почему оператор может запросить дополнительную проверку.", "Получение выплаты", ["Перед первой заявкой обычно требуется подтверждение личности и платёжного метода.", "Сроки зависят от выбранного способа, проверки аккаунта и правил оператора.", "Не соглашайтесь на помощь посредников, которые просят пароль или код."]],
  ["acrpoker-first-deposit-bonus", "Бонус на первый депозит ACR Poker: как читать условия", "Объясняем, какие параметры бонуса важно проверить до пополнения: срок, требования и ограничения.", "Условия бонуса", ["Размер предложения не равен гарантированной выплате: изучите правила отыгрыша.", "Проверьте срок действия, минимальный депозит и допустимые форматы игры.", "Условия могут меняться, поэтому приоритет имеет информация в аккаунте оператора."]],
  ["acrpoker-freerolls", "Фрироллы ACR Poker: турниры без вступительного взноса", "Как устроены бесплатные турниры, где смотреть расписание и на что обратить внимание новичку.", "Бесплатные турниры", ["Фриролл не требует стандартного бай-ина, но может иметь условия допуска.", "Расписание и призовой фонд проверяйте в лобби перед регистрацией.", "Даже бесплатный формат требует контроля времени и ответственного отношения к игре."]],
  ["acrpoker-tournaments", "Турниры ACR Poker: форматы, бай-ины и структура", "Краткий справочник по MTT, турбо-форматам, сателлитам и турнирам с наградами за выбивание.", "Турнирная игра", ["Оцените продолжительность турнира и структуру роста блайндов до регистрации.", "Бай-ин должен соответствовать заранее определённому бюджету.", "Гарантированный призовой фонд не означает гарантированный выигрыш участника."]],
  ["acrpoker-cash-games", "Кэш-игры ACR Poker: лимиты и управление банкроллом", "Чем кэш-столы отличаются от турниров и почему лимиты важнее размера потенциального банка.", "Игра за кэш-столами", ["За кэш-столом стоимость фишек напрямую связана с денежным балансом.", "Заранее установите лимит сессии и максимальный допустимый убыток.", "Повышение лимитов не компенсирует предыдущие проигрыши и увеличивает риск."]],
  ["acrpoker-staking", "Что такое стейкинг в онлайн-покере", "Нейтральное объяснение долевого участия в турнирах, наценки и распределения результата.", "Стейкинг", ["Стейкер финансирует часть бай-ина игрока в обмен на согласованную долю результата.", "До сделки письменно зафиксируйте турнир, доли, наценку и порядок расчётов.", "Стейкинг несёт финансовый риск и не гарантирует возврат вложений."]]
];

const oneWinPages = [
  ["1win", "1win (1вин): обзор сайта, входа, зеркала и приложения", "Информационная страница о платформе 1win: основные разделы, способы доступа, бонусные предложения и важные ограничения.", "main"],
  ["1win-zerkalo", "1win зеркало и вход: как проверить актуальный адрес", "Как отличать официальный переход от копии, проверять HTTPS и не передавать данные посторонним сайтам.", "main"],
  ["1win-bonus", "Бонусы 1win: условия, промокоды и ограничения", "Какие пункты правил нужно изучить до активации предложения и внесения депозита.", "bonus"],
  ["1win-prilozhenie", "Приложение 1win для Android и iOS", "Обзор мобильного доступа, требований к установке и базовых мер безопасности.", "app"],
  ["1win-depozit-vyvod", "Депозит и вывод в 1win: методы, сроки и проверка", "Что учитывать при выборе платёжного метода и почему обработка заявки может занять дополнительное время.", "main"]
];

const esc = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const pathFor = slug => slug ? `/${slug}/` : "/";

function shell({ title, description, slug = "", body, schemaType = "Article" }) {
  const canonical = `${origin}${pathFor(slug)}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: title,
    description,
    inLanguage: "ru-RU",
    dateModified: today,
    mainEntityOfPage: canonical,
    publisher: { "@type": "Organization", name: "BigPoker.ru", url: origin }
  };
  return `<!doctype html>
<html lang="ru"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="yandex-verification" content="6254f14f92eca783">
<title>${esc(title)} | BigPoker.ru</title>
<meta name="description" content="${esc(description)}">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="canonical" href="${canonical}"><link rel="stylesheet" href="/styles.css">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
<!-- Yandex.Metrika counter --><script type="text/javascript">(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(112157479,"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});</script><noscript><div><img src="https://mc.yandex.ru/watch/112157479" style="position:absolute;left:-9999px" alt=""></div></noscript><!-- /Yandex.Metrika counter --></head><body>
<header class="site-header"><div class="wrap header-row"><a class="logo" href="/">BIG<span>POKER</span><small>.RU</small></a><nav class="nav" aria-label="Основная навигация"><a href="/">Главная</a><a href="/acrpoker-download/">ACR Poker</a><a href="/acrpoker-tournaments/">Турниры</a><a class="nav-hot" href="/1win/">1win</a></nav></div></header>
<main>${body}</main>
<footer class="site-footer"><div class="wrap footer-row"><p><strong>BigPoker.ru</strong> · Покер, турниры и игровые платформы</p><p class="legal">18+ · Играйте ответственно. Материалы носят информационный характер.</p></div></footer>
</body></html>`;
}

function oldArticle([slug, title, description, label, bullets]) {
  const links = oldPages.filter(p => p[0] !== slug).slice(0, 5).map(p => `<li><a href="/${p[0]}/">${esc(p[1])}</a></li>`).join("");
  const body = `<div class="article-hero"><div class="article-shell"><p class="breadcrumbs"><a href="/">Главная</a><span>ACR Poker</span><span>${esc(label)}</span></p><span class="eyebrow">Гид по ACR Poker</span><h1>${esc(title)}</h1><p class="lead">${esc(description)}</p></div></div><article class="article"><div class="article-main"><h2>${esc(label)}: главное</h2>${bullets.map(x => `<p>${esc(x)}</p>`).join("")}<h2>Безопасность аккаунта</h2><ul><li>Проверяйте адрес сайта и данные получателя платежа.</li><li>Никому не сообщайте пароль и коды подтверждения.</li><li>Заранее определяйте лимит игровой сессии.</li></ul><div class="inline-promo"><div><span>ДРУГАЯ ПЛАТФОРМА</span><h3>Обзор 1win</h3><p>Вход, бонусы, приложение и актуальный адрес — в одном материале.</p></div><a class="btn" href="/1win/">Открыть обзор</a></div></div><aside class="article-side related"><h3>Читайте также</h3><ul>${links}</ul></aside></article>`;
  return shell({ title, description, slug, body });
}

function oneWinArticle([slug, title, description, cta]) {
  const ctaPath = cta === "bonus" ? "/go/1win-bonus/" : cta === "app" ? "/go/1win-app/" : "/go/1win-main/";
  const body = `<div class="article-hero product-hero"><div class="article-shell"><p class="breadcrumbs"><a href="/">Главная</a><span>1win</span><span>Обзор</span></p><span class="eyebrow">Обзор платформы · 18+</span><h1>${esc(title)}</h1><p class="lead">${esc(description)}</p><div class="hero-actions"><a class="btn btn-accent" href="${ctaPath}" rel="nofollow sponsored">Перейти на 1win <b>↗</b></a><span>Быстрый переход на актуальный адрес</span></div></div></div><article class="article"><div class="article-main"><div class="quick-row"><div><strong>Вход</strong><span>Через актуальный адрес</span></div><div><strong>Бонусы</strong><span>Условия перед активацией</span></div><div><strong>Приложение</strong><span>Android и веб-версия</span></div></div><h2>Что важно знать</h2><p>Платформа объединяет ставки на спорт, казино и мобильный доступ. Перед регистрацией проверьте доступность сервиса в своей стране, актуальные условия предложения и требования к аккаунту.</p><h2>Вход и регистрация</h2><p>Используйте актуальный адрес, создайте уникальный пароль и подтвердите контактные данные. Для отдельных операций оператор может запросить проверку личности.</p><h2>Бонусы и платежи</h2><p>Перед активацией предложения посмотрите минимальный депозит, срок действия и требования к обороту. Методы пополнения и вывода отображаются в кассе аккаунта.</p><h2>Мобильный доступ</h2><p>Открыть платформу можно в браузере телефона или через приложение, если оно доступно для вашего устройства и региона.</p><div class="bottom-cta"><div><span>1WIN</span><h3>Готовы продолжить?</h3><p>Откройте актуальную версию сайта.</p></div><a class="btn btn-accent" href="${ctaPath}" rel="nofollow sponsored">Перейти на сайт <b>↗</b></a></div></div><aside class="article-side related"><h3>Разделы 1win</h3><ul>${oneWinPages.filter(p => p[0] !== slug).map(p => `<li><a href="/${p[0]}/">${esc(p[1])}</a></li>`).join("")}</ul><p class="side-note">18+ · Игра связана с финансовым риском.</p></aside></article>`;
  return shell({ title, description, slug, body });
}

function homepage() {
  const acrCards = oldPages.slice(0, 6).map(p => `<article class="card"><h3>${esc(p[1])}</h3><p>${esc(p[2])}</p><a href="/${p[0]}/">Читать материал →</a></article>`).join("");
  const body = `<section class="hero"><div class="wrap hero-grid"><div><span class="eyebrow">Покерный журнал с 2007 года</span><h1>Игра начинается с правильного решения</h1><p>Гиды по онлайн-покеру, турнирам, приложениям и игровым платформам.</p><div class="actions"><a class="btn btn-accent" href="/1win/">Открыть 1win <b>↗</b></a><a class="text-link" href="/acrpoker-download/">Гид по ACR Poker →</a></div></div><div class="hero-board"><span class="board-kicker">В ФОКУСЕ</span><strong>1WIN</strong><p>Вход · бонусы · приложение</p><a href="/1win/">Перейти к обзору ↗</a><div class="suits" aria-hidden="true">♠ <i>♥</i> ♣ <i>♦</i></div></div></div></section><div class="topic-bar"><div class="wrap"><span>ПОКЕР</span><span>ТУРНИРЫ</span><span>СТРАТЕГИЯ</span><span>ПЛАТФОРМЫ</span><span>БОНУСЫ</span></div></div><section class="section"><div class="wrap"><div class="section-head"><div><span class="section-kicker">БАЗА ЗНАНИЙ</span><h2>ACR Poker</h2></div><a href="/acrpoker-download/">Все материалы →</a></div><div class="grid">${acrCards}</div></div></section><section class="section dark-section"><div class="wrap"><div class="section-head"><div><span class="section-kicker">ОБЗОР ПЛАТФОРМЫ</span><h2>Всё о 1win</h2></div><a href="/1win/">Открыть раздел →</a></div><div class="platform-grid"><article class="featured-card"><span>ГЛАВНЫЙ МАТЕРИАЛ</span><h3>1win: вход, зеркало и приложение</h3><p>Коротко о регистрации, мобильном доступе и способах оплаты.</p><a class="btn btn-accent" href="/1win/">Читать обзор</a></article><a class="mini-card" href="/1win-bonus/"><b>01</b><span>Бонусы 1win</span><em>Условия и активация →</em></a><a class="mini-card" href="/1win-prilozhenie/"><b>02</b><span>Приложение</span><em>Android и iOS →</em></a></div></div></section>`;
  return shell({ title: "BigPoker.ru — онлайн-покер, ACR Poker и обзоры игровых платформ", description: "Независимый покерный портал: инструкции ACR Poker, турниры, платежи, безопасность и обзор 1win.", body, schemaType: "WebSite" });
}

async function emit(path, content) {
  const file = join(out, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content, "utf8");
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await emit("index.html", homepage());
for (const page of oldPages) await emit(`${page[0]}/index.html`, oldArticle(page));
for (const page of oneWinPages) await emit(`${page[0]}/index.html`, oneWinArticle(page));
await copyFile(join(root, "styles.css"), join(out, "styles.css"));
await emit("google8f3035e0c95e8767.html", "google-site-verification: google8f3035e0c95e8767.html");
await emit("robots.txt", `User-agent: *\nAllow: /\nDisallow: /go/\n\nSitemap: ${origin}/sitemap.xml\n`);
const urls = ["", ...oldPages.map(p => p[0]), ...oneWinPages.map(p => p[0])];
await emit("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(slug => `  <url><loc>${origin}${pathFor(slug)}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
await emit("404.html", shell({ title: "Страница не найдена", description: "Запрошенная страница не найдена.", body: `<article class="article"><h1>Страница не найдена</h1><p>Адрес мог измениться. Вернитесь на <a href="/">главную страницу</a> или откройте <a href="/acrpoker-download/">справочник ACR Poker</a>.</p></article>` }));
console.log(`Built ${urls.length} indexable pages in ${out}`);
