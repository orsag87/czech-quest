/* ============================================================================
   NATASHA'S CZECH QUEST — CONTENT FILE
   ----------------------------------------------------------------------------
   This is the file Jan edits to add or fix lessons. Nothing here is code logic —
   it's just the stories and quizzes. Safe to edit by hand.

   HOW A STORY WORKS
   -----------------
   {
     id:       unique slug, e.g. "b1-byt"  (never reuse an id)
     level:    "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
     diff:     1..5  (ordering/difficulty WITHIN a level; lower = show first)
     titleCz:  Czech title
     titleEn:  English title
     text:     the story. Wrap any word you want tappable like [czech|english].
               Example: "[Ráno|In the morning] vstávám." -> "Ráno" is tappable.
     quiz:     array of questions (see below)
   }

   QUESTION TYPES
   --------------
   Multiple choice:
     { q:"...", opts:["a","b","c"], a:1, skill:"comprehension" }
        a = index of the correct option (0-based)
   Fill in the blank:
     { q:"Doplň: ...[...]...", opts:[], a:["answer","alt answer"], type:"fill",
       skill:"cases", explain:"why this is right" }
        a = array of accepted answers (case/accent-insensitive)
   Optional flags on any question:
     trick:true   -> marks a "pozor!" careful-reading question
     explain:"…"  -> shown after answering (HTML allowed, use <b> for bold)

   SKILLS: the skill string must match a key in SKILLS below. That's how the
   weak-spot coaching + spaced repetition know what to drill.
   ========================================================================== */

const SKILLS = {
  "comprehension":   { name:"Reading comprehension", lesson:"Read the whole passage before answering — the answer often hinges on a later sentence. Watch out for pivot words that flip meaning: <b>ale</b> (but), <b>naopak</b> (on the contrary), <b>nakonec</b> (in the end), <b>na druhou stranu</b> (on the other hand)." },
  "vocab-daily":     { name:"Everyday vocabulary", lesson:"High-frequency daily words. The trick to making them stick: don't just read them — say a short sentence of your own using each new word out loud." },
  "vocab-food":      { name:"Food vocabulary", lesson:"Food words: <b>jídlo</b> food, <b>maso</b> meat, <b>ovoce</b> fruit, <b>zelenina</b> vegetables, <b>polévka</b> soup, <b>pečivo</b> baked goods, <b>vejce</b> egg." },
  "vocab-travel":    { name:"Travel vocabulary", lesson:"Travel words: <b>cesta</b> journey, <b>výlet</b> trip, <b>dovolená</b> holiday, <b>ubytovat se</b> to check in, <b>půjčit si</b> to rent, <b>pláž</b> beach." },
  "vocab-abstract":  { name:"Abstract vocabulary", lesson:"Higher-level texts lean on abstract nouns. Learn them inside set phrases: <b>podle mého názoru</b> (in my opinion), <b>dát přednost</b> (to prefer), <b>záležet na</b> (to depend on)." },
  "vocab-idiom":     { name:"Idioms & false friends", lesson:"Some phrases don't translate word-for-word. <b>připravit o</b> = to deprive of (NOT 'prepare'). <b>pohltit</b> = to engross. <b>od nepaměti</b> = since time immemorial. Learn each as one whole unit." },
  "past-tense":      { name:"Past tense", lesson:"Czech past = participle (-l / -la / -lo / -li) + present of <b>být</b> for I/you: <b>byl jsem</b>, <b>jeli jsme</b>. In he/she/it/they the helper drops: <b>on jel</b>, <b>oni jeli</b>." },
  "conditional":     { name:"Conditional (would)", lesson:"'Would' uses <b>bych / bys / by / bychom</b>: <b>chtěl bych</b> (I'd like), <b>nechtěl bych se vrátit</b> (I wouldn't want to go back). For 'if', pair it with <b>kdyby</b>: <b>kdybych měl čas, šel bych</b>." },
  "connectives":     { name:"Linking words", lesson:"Connectives steer the sentence: <b>protože</b> because, <b>ale</b> but, <b>zároveň</b> at the same time, <b>na druhou stranu</b> on the other hand, <b>nakonec</b> finally." },
  "cases":           { name:"Noun cases", lesson:"Czech endings shift by role in the sentence. <b>káva</b> → <b>piju kávu</b> (the object takes accusative). Don't grind tables — notice the ending change in each sentence you read." },
  "grammar-clauses": { name:"Complex sentences", lesson:"Watch the joining words: <b>aby / abychom</b> (so that), <b>místo aby</b> (instead of), <b>jestli / zda</b> (whether). These often trigger a special verb form." }
};

/* Each story's first quiz question type/skill should roughly match its content.
   diff orders stories within a level (1 = first shown). */
const STORIES = [
  /* ===================== A1 ===================== */
  { id:"a1-rodina", level:"A1", diff:1, titleCz:"Moje rodina", titleEn:"My family",
    text:"[Jmenuji se|My name is] Tom. [Mám|I have] velkou [rodinu|family]. Můj [táta|dad] je doktor. Moje [máma|mom] je [učitelka|teacher]. Mám jednoho [bratra|brother] a jednu [sestru|sister]. Máme také [psa|a dog]. Pes je [malý|small] a [černý|black]. Mám svou rodinu [rád|I love].",
    quiz:[
      { q:"Co dělá Tomův táta?", opts:["učitel","doktor","kuchař"], a:1, skill:"comprehension" },
      { q:"Kolik má Tom sourozenců?", opts:["jednoho","dva","tři"], a:1, skill:"comprehension" },
      { q:"Jaký je pes?", opts:["velký a bílý","malý a černý","starý"], a:1, skill:"vocab-daily" }
    ]},
  { id:"a1-den", level:"A1", diff:2, titleCz:"Můj den", titleEn:"My day",
    text:"[Ráno|In the morning] [vstávám|I get up] v sedm hodin. [Snídám|I have breakfast] chléb a [piju|I drink] [čaj|tea]. Potom jdu do [školy|school]. Ve škole se [učím|I learn] česky a anglicky. V poledne mám [oběd|lunch]. Odpoledne jdu [domů|home]. Večer se [dívám na|I watch] televizi. V deset hodin jdu [spát|to sleep].",
    quiz:[
      { q:"V kolik hodin vstává?", opts:["v šest","v sedm","v osm"], a:1, skill:"comprehension" },
      { q:"Co se učí ve škole?", opts:["matematiku","česky a anglicky","hudbu"], a:1, skill:"comprehension" },
      { q:"Co dělá večer?", opts:["sportuje","dívá se na televizi","vaří"], a:1, skill:"vocab-daily" }
    ]},
  { id:"a1-jidlo", level:"A1", diff:3, titleCz:"Jídlo", titleEn:"Food",
    text:"Mám [rád|I like] jídlo. Ráno [jím|I eat] [rohlík|a roll] a [sýr|cheese]. Piju [mléko|milk] nebo kávu. K obědu mám [polévku|soup] a [maso|meat]. Rád piju [vodu|water]. Mám rád [ovoce|fruit], hlavně [jablka|apples] a banány. [Nemám rád|I don't like] [ryby|fish]. Moje máma [vaří|cooks] moc dobře.",
    quiz:[
      { q:"Co jí ráno?", opts:["polévku","rohlík a sýr","rybu"], a:1, skill:"vocab-food" },
      { q:"Jaké ovoce má rád?", opts:["jablka a banány","jen pomeranče","žádné"], a:0, skill:"vocab-food" },
      { q:"Co nemá rád?", opts:["maso","ryby","ovoce"], a:1, skill:"comprehension" }
    ]},

  /* ===================== A2 ===================== */
  { id:"a2-eva", level:"A2", diff:1, titleCz:"Evin obyčejný den", titleEn:"Eva's ordinary day",
    text:"Ráno Eva [vstává|gets up] v sedm hodin. [Nejdřív|First] si dělá kávu a čte [noviny|newspaper]. Pak jde do práce [pěšky|on foot], protože [bydlí|she lives] [blízko|near] centra. V práci pracuje na počítači a mluví s [kolegy|colleagues]. [V poledne|At noon] [obědvá|has lunch] v malé restauraci u parku. Má ráda [polévku|soup] a salát. Odpoledne se [vrací|returns] domů a [vaří|cooks] večeři pro svého [manžela|husband]. Večer [spolu|together] [sledují|they watch] film nebo čtou knihu. Eva je ráda, že má [klidný|calm] a [šťastný|happy] život.",
    quiz:[
      { q:"V kolik hodin Eva vstává?", opts:["v šest","v sedm","v osm"], a:1, skill:"comprehension" },
      { q:"Jak Eva jde do práce?", opts:["autem","pěšky","autobusem"], a:1, skill:"vocab-daily" },
      { q:"Co Eva ráda jí v restauraci?", opts:["polévku a salát","maso a rýži","pizzu"], a:0, skill:"vocab-food" },
      { q:"Doplň: Eva má [...] a šťastný život.", opts:[], a:["klidný"], type:"fill", skill:"vocab-daily", explain:"<b>klidný</b> = calm / peaceful." }
    ]},
  { id:"a2-kavarna", level:"A2", diff:2, titleCz:"V kavárně", titleEn:"At the café",
    text:"Petr rád chodí do [kavárny|café] u [nádraží|train station]. Káva tam je výborná a není [drahá|expensive]. Dnes ráno si [sedá|sits down] k oknu a [dívá se|looks] na ulici. Přichází [číšník|waiter] a [ptá se|asks]: „Co si dáte?“ Petr si [dává|orders] velké cappuccino a kousek [dortu|cake]. [Čeká|waits] na kamaráda Tomáše. Tomáš přichází [pozdě|late], protože autobus měl [zpoždění|a delay]. Spolu mluví o práci a o víkendu. Petr [platí|pays] kartou a dává číšníkovi [spropitné|a tip].",
    quiz:[
      { q:"Kam Petr rád chodí?", opts:["do kavárny","do kina","do divadla"], a:0, skill:"comprehension" },
      { q:"Co si Petr dává?", opts:["čaj a chleba","cappuccino a dort","jen vodu"], a:1, skill:"vocab-food" },
      { q:"Proč přichází Tomáš pozdě? (pozor!)", opts:["zaspal","autobus měl zpoždění","nechtěl přijít"], a:1, skill:"comprehension", trick:true, explain:"Trick: the text never says Tomáš overslept — it says the bus was delayed (<b>autobus měl zpoždění</b>). Pick only what the text actually states." },
      { q:"Jak Petr platí?", opts:["hotově","kartou","telefonem"], a:1, skill:"comprehension" }
    ]},
  { id:"a2-vikend", level:"A2", diff:3, titleCz:"Víkendové plány", titleEn:"Weekend plans",
    text:"O víkendu [chce|wants] Lucie [jet|to go] na [výlet|a trip] do hor. Počasí má být krásné, [slunečno|sunny] a teplo. V sobotu ráno vstává [brzy|early] a [balí si|packs] [batoh|backpack]. Bere si vodu, [svačinu|a snack] a teplé [oblečení|clothes]. Její kamarádka Jana jede s ní. [Cesta|The journey] vlakem [trvá|lasts] dvě hodiny. V horách jdou na dlouhou [procházku|walk] a fotí [krajinu|landscape]. Večer se vracejí domů [unavené|tired], ale [spokojené|content].",
    quiz:[
      { q:"Kam chce Lucie jet?", opts:["k moři","do hor","do města"], a:1, skill:"vocab-travel" },
      { q:"Jak dlouho trvá cesta vlakem?", opts:["jednu hodinu","dvě hodiny","celý den"], a:1, skill:"comprehension" },
      { q:"Co dělají v horách?", opts:["plavou","jdou na procházku a fotí","spí"], a:1, skill:"comprehension" },
      { q:"Jak se cítí večer?", opts:["smutné","unavené, ale spokojené","nemocné"], a:1, skill:"connectives" }
    ]},
  { id:"a2-nakup", level:"A2", diff:4, titleCz:"Nákup v supermarketu", titleEn:"Shopping",
    text:"V pátek odpoledne jde Marek do [supermarketu|supermarket]. Doma nemá skoro nic [k jídlu|to eat]. Bere si [vozík|a cart] a začíná u [zeleniny|vegetables]. Kupuje [rajčata|tomatoes], papriky a [brambory|potatoes]. Potom jde k [pečivu|bakery section] a bere si [čerstvý|fresh] chléb. Nesmí [zapomenout|to forget] na mléko, máslo a [vajíčka|eggs]. U [pokladny|checkout] čeká dlouhá [fronta|queue]. Marek platí kartou a dává si nákup do [tašky|a bag].",
    quiz:[
      { q:"Kam jde Marek?", opts:["do banky","do supermarketu","do školy"], a:1, skill:"comprehension" },
      { q:"Co kupuje u zeleniny?", opts:["maso","rajčata a brambory","jen ovoce"], a:1, skill:"vocab-food" },
      { q:"Co je u pokladny?", opts:["jeho kamarád","dlouhá fronta","velká sleva"], a:1, skill:"comprehension" },
      { q:"Doplň: Marek platí [...].", opts:[], a:["kartou"], type:"fill", skill:"cases", explain:"<b>kartou</b> = by card (instrumental case — the 'by means of' ending, often -ou/-em)." }
    ]},
  { id:"a2-pocasi", level:"A2", diff:5, titleCz:"Roční období", titleEn:"The seasons",
    text:"Anna má ráda všechna [roční období|seasons]. Na [jaře|spring] [kvetou|bloom] stromy a je teplo. [Ptáci|Birds] zpívají a dny jsou delší. V [létě|summer] je [horko|hot] a Anna ráda plave v [jezeře|a lake]. Často jí [zmrzlinu|ice cream]. Na [podzim|autumn] padá [listí|leaves] a [fouká|blows] [vítr|wind]. Anna nosí teplý [svetr|sweater]. V [zimě|winter] někdy [sněží|it snows]. Anna staví [sněhuláka|a snowman] a jezdí na [lyžích|skis].",
    quiz:[
      { q:"Co dělá Anna v létě?", opts:["staví sněhuláka","plave v jezeře","nosí svetr"], a:1, skill:"comprehension" },
      { q:"Co se děje na podzim?", opts:["kvetou stromy","padá listí a fouká vítr","je horko"], a:1, skill:"comprehension" },
      { q:"Co nosí Anna na podzim?", opts:["plavky","teplý svetr","nic"], a:1, skill:"vocab-daily" },
      { q:"Co dělá v zimě?", opts:["plave","staví sněhuláka a lyžuje","fotí"], a:1, skill:"comprehension" }
    ]},

  /* ===================== B1 ===================== */
  { id:"b1-byt", level:"B1", diff:1, titleCz:"Stěhování do nového bytu", titleEn:"Moving to a new flat",
    text:"Minulý měsíc jsme se s přítelkyní [přestěhovali|moved house] do nového [bytu|flat]. [Hledali jsme|We searched] dlouho, protože v centru jsou byty velmi [drahé|expensive]. [Nakonec|In the end] jsme našli pěkný byt [kousek od|a short way from] parku. Není sice velký, ale má krásný [výhled|view] a hodně světla. První dny byly [náročné|demanding] — museli jsme všechno [vybalit|unpack] a [uklidit|tidy up]. [Sousedé|The neighbours] jsou [přátelští|friendly] a hned nás pozvali na kávu. Myslím, že jsme se [rozhodli|decided] správně.",
    quiz:[
      { q:"Proč hledali byt dlouho?", opts:["nebyl čas","byty v centru jsou drahé","nechtěli se stěhovat"], a:1, skill:"comprehension" },
      { q:"Jaký je nový byt? (pozor)", opts:["velký a tmavý","není velký, ale světlý s výhledem","starý a hlučný"], a:1, skill:"connectives", trick:true, explain:"Trick: <b>není sice velký, ALE…</b> The word <b>ale</b> flips the sentence — it's small yet bright with a view. Don't stop reading at 'small'." },
      { q:"Jací jsou sousedé?", opts:["nepříjemní","přátelští","tiší"], a:1, skill:"comprehension" },
      { q:"Doplň minulý čas: „[...] jsme se správně.“ (rozhodnout se)", opts:[], a:["rozhodli","rozhodli jsme se"], type:"fill", skill:"past-tense", explain:"Past tense: <b>rozhodli jsme se</b> = we decided. Participle -li (plural) + helper jsme." }
    ]},
  { id:"b1-domov", level:"B1", diff:2, titleCz:"Práce z domova", titleEn:"Working from home",
    text:"Už dva roky [pracuji z domova|I work from home] a musím říct, že mi to [vyhovuje|suits me]. [Dřív|Before] jsem každý den [jezdil|used to commute] do [kanceláře|office] a cesta mi [trvala|took] skoro hodinu. Teď mám víc času na rodinu i na své [koníčky|hobbies]. [Samozřejmě|Of course] to má i [nevýhody|disadvantages] — někdy se cítím [osamělý|lonely] a [chybí mi|I miss] kolegové. Proto se [snažím|I try] alespoň jednou týdně [sejít se|meet up] s přáteli. Celkově jsem [spokojený|satisfied] a [nechtěl bych se vrátit|I wouldn't want to go back].",
    quiz:[
      { q:"Jak dlouho pracuje z domova?", opts:["půl roku","dva roky","deset let"], a:1, skill:"comprehension" },
      { q:"Co dělal dřív?", opts:["pracoval z domova","jezdil do kanceláře","nepracoval"], a:1, skill:"past-tense" },
      { q:"Jaká je nevýhoda?", opts:["málo peněz","cítí se osamělý","dlouhá cesta"], a:1, skill:"comprehension" },
      { q:"„Nechtěl bych se vrátit“ znamená:", opts:["I must return","I wouldn't want to return","I am returning"], a:1, skill:"conditional", explain:"<b>bych</b> = the 'would' marker. <b>nechtěl bych</b> = I wouldn't want to." }
    ]},
  { id:"b1-dovolena", level:"B1", diff:3, titleCz:"Dovolená u moře", titleEn:"A holiday by the sea",
    text:"Loni v létě jsme [jeli|went] na [dovolenou|holiday] k [moři|the sea] do Chorvatska. [Cestovali jsme|We travelled] autem a cesta [trvala|lasted] skoro celý den. [Ubytovali jsme se|We stayed] v malém penzionu blízko [pláže|the beach]. Každé ráno jsme [plavali|swam] v čistém moři a [opalovali se|sunbathed]. K obědu jsme zkoušeli [místní|local] jídla, hlavně [čerstvé|fresh] ryby. Jednou jsme si [půjčili|rented] loď a jeli na malý [ostrov|island]. Počasí nám [přálo|was kind to us], jen poslední den [pršelo|it rained].",
    quiz:[
      { q:"Kam jeli na dovolenou?", opts:["do hor","k moři do Chorvatska","do velkého města"], a:1, skill:"vocab-travel" },
      { q:"Jak cestovali?", opts:["letadlem","autem","vlakem"], a:1, skill:"past-tense" },
      { q:"Jaké bylo počasí? (pozor)", opts:["celou dobu pršelo","dobré, jen poslední den pršelo","byla zima"], a:1, skill:"comprehension", trick:true, explain:"Trick: it rained only on the last day. <b>jen poslední den pršelo</b> — the word <b>jen</b> (only) limits it. Easy to misread as 'it rained the whole time'." },
      { q:"Doplň: „[...] jsme si loď.“ (půjčit si, minulý čas)", opts:[], a:["půjčili","půjčili jsme si"], type:"fill", skill:"past-tense", explain:"<b>půjčili jsme si</b> = we rented/borrowed. Reflexive <b>si</b> stays with the verb." }
    ]},

  /* ===================== B2 ===================== */
  { id:"b2-mesto", level:"B2", diff:1, titleCz:"Město, nebo venkov?", titleEn:"City or countryside?",
    text:"Často [přemýšlím|I think about] o tom, jestli je lepší bydlet ve městě, nebo na venkově. Ve městě je [nepochybně|undoubtedly] víc [příležitostí|opportunities] — práce, kultura a dobrá [doprava|transport]. [Na druhou stranu|On the other hand] je tam [hluk|noise], spěch a všechno je dražší. Venkov [nabízí|offers] klid, čistý [vzduch|air] a blízkost [přírody|nature], ale chybí tam [pohodlí|comfort], na které jsme [zvyklí|used to]. Kdybych si měl vybrat, asi bych [dal přednost|would prefer] menšímu městu, které spojuje výhody obojího. Nakonec [záleží|it depends] spíš na lidech kolem nás než na tom, kde žijeme.",
    quiz:[
      { q:"Co nabízí venkov podle autora?", opts:["víc práce a kultury","klid, čistý vzduch a přírodu","levné restaurace"], a:1, skill:"comprehension" },
      { q:"Co by si autor nakonec vybral? (pozor)", opts:["velké město","venkov","menší město"], a:2, skill:"conditional", trick:true, explain:"Trick: he opens by praising the city, but with <b>kdybych si měl vybrat</b> (if I had to choose) he actually picks a smaller town. The conditional reveals his real choice — read to the end." },
      { q:"„Dát přednost“ znamená:", opts:["to refuse","to prefer","to postpone"], a:1, skill:"vocab-abstract" },
      { q:"Doplň: „Na druhou [...], je tam hluk.“ (idiom)", opts:[], a:["stranu"], type:"fill", skill:"connectives", explain:"<b>na druhou stranu</b> = on the other hand. A fixed phrase — learn it whole." }
    ]},
  { id:"b2-site", level:"B2", diff:2, titleCz:"Sociální sítě", titleEn:"Social media",
    text:"Sociální sítě se staly [nedílnou součástí|an integral part] našeho života, ať se nám to líbí, nebo ne. [Umožňují|They allow] nám zůstat v kontaktu s přáteli. [Zároveň|At the same time] však mohou být [návykové|addictive] a [krást|steal] nám čas. Mnozí lidé [srovnávají|compare] svůj život s [dokonalými|perfect] obrázky ostatních a cítí se pak hůř. [Podle mého názoru|In my opinion] není problém v samotných sítích, ale v tom, jak je [používáme|we use them]. Kdybychom je používali [s mírou|in moderation], mohly by spíš pomáhat než [škodit|harm]. Klíčové je nezapomínat na svět mimo [obrazovku|the screen].",
    quiz:[
      { q:"Jaký je hlavní názor autora?", opts:["sítě jsou jednoznačně špatné","problém je v tom, jak je používáme","sítě nemají žádné nevýhody"], a:1, skill:"comprehension" },
      { q:"„Návykový“ znamená:", opts:["expensive","addictive","useful"], a:1, skill:"vocab-abstract" },
      { q:"Co by se stalo, kdybychom je používali s mírou?", opts:["mohly by pomáhat","přestaly by fungovat","byly by dražší"], a:0, skill:"conditional" },
      { q:"Doplň: „Podle mého [...], problém není v sítích.“ (in my opinion)", opts:[], a:["názoru"], type:"fill", skill:"vocab-abstract", explain:"<b>podle mého názoru</b> = in my opinion. Useful for stating any opinion." }
    ]},

  /* ===================== C1 ===================== */
  { id:"c1-ai", level:"C1", diff:1, titleCz:"Umělá inteligence a práce", titleEn:"AI and the future of work",
    text:"Rozvoj [umělé inteligence|artificial intelligence] [vyvolává|raises] čím dál častěji otázku, jak bude vypadat budoucnost práce. Někteří se [obávají|fear], že stroje [nahradí|will replace] lidi a [připraví je o|deprive them of] zaměstnání. Jiní naopak [tvrdí|claim], že nové technologie vždy vytvořily víc pracovních míst, než kolik jich [zaniklo|disappeared]. Pravda bude [zřejmě|probably] někde uprostřed. Je téměř jisté, že řada profesí projde [proměnou|a transformation] a že se budeme muset neustále učit novým [dovednostem|skills]. Místo abychom se technologií [báli|feared], měli bychom se naučit je využívat ve svůj [prospěch|benefit]. Schopnost [přizpůsobit se|to adapt] změnám provází lidstvo [od nepaměti|since time immemorial].",
    quiz:[
      { q:"Jaký je pravděpodobný závěr autora?", opts:["stroje zničí všechnu práci","pravda je někde uprostřed","technologie nemají žádný vliv"], a:1, skill:"comprehension" },
      { q:"„Připravit někoho o práci“ znamená: (pozor)", opts:["to prepare someone for work","to deprive someone of work","to promote someone"], a:1, skill:"vocab-idiom", trick:true, explain:"False friend! <b>připravit O něco</b> = to deprive of something, NOT 'to prepare'. The preposition <b>o</b> changes everything." },
      { q:"„Místo abychom se báli“ vyjadřuje:", opts:["a command","instead of fearing","the past"], a:1, skill:"grammar-clauses", explain:"<b>místo aby</b> = instead of (doing). It sets up an alternative to the action." },
      { q:"Doplň: „využívat ve svůj [...].“ (benefit)", opts:[], a:["prospěch"], type:"fill", skill:"vocab-abstract", explain:"<b>ve svůj prospěch</b> = to one's own benefit." }
    ]},
  { id:"c1-knihy", level:"C1", diff:2, titleCz:"Knihy versus filmy", titleEn:"Books vs. films",
    text:"Věčná debata o tom, [zda|whether] jsou lepší knihy, nebo jejich filmové [adaptace|adaptations], asi nikdy [neutichne|won't die down]. [Zastánci|Advocates] knih [argumentují|argue] tím, že kniha nechává [prostor|room] fantazii a umožňuje hlubší [ponoření|immersion] do příběhu. Filmoví [nadšenci|enthusiasts] naproti tomu [oceňují|appreciate] vizuální [zážitek|experience]. Osobně si myslím, že obě formy mají své [kouzlo|charm] a nelze je jednoduše [srovnávat|compare]. Dobrá adaptace dokáže knihu [obohatit|enrich], zatímco špatná ji může [nenávratně|irreversibly] pokazit. Podstatné je, že nás příběh dokáže [pohltit|engross] a něco v nás [zanechat|leave behind].",
    quiz:[
      { q:"Jaký názor zastává autor?", opts:["knihy jsou vždy lepší","obě formy mají své kouzlo","filmy jsou ztráta času"], a:1, skill:"comprehension" },
      { q:"„Pohltit“ zde znamená:", opts:["to bore","to engross / absorb","to translate"], a:1, skill:"vocab-idiom" },
      { q:"Co dokáže špatná adaptace?", opts:["obohatit knihu","nenávratně ji pokazit","zvýšit prodej knihy"], a:1, skill:"comprehension" },
      { q:"Doplň: „Kniha nechává [...] fantazii.“ (room)", opts:[], a:["prostor"], type:"fill", skill:"vocab-abstract", explain:"<b>nechat prostor</b> = to leave room/space (for)." }
    ]},

  /* ===== WAVE 1 — added 2026-06 (B1–C2). QC by Jan (native). ===== */

  /* --- B1 --- */
  { id:"b1-recept", level:"B1", diff:4, titleCz:"Vaříme svíčkovou", titleEn:"Cooking svíčková",
    text:"Dnes [vařím|I'm cooking] [svíčkovou|svíčková (beef in cream sauce)], typické české jídlo. [Nejdřív|First] si připravím [hovězí maso|beef] a [kořenovou zeleninu|root vegetables] — mrkev, [petržel|parsley root] a [celer|celeriac]. Maso [orestuji|I sear] na [pánvi|pan] a pak ho dám [péct|to roast] do trouby. Zeleninu [podusím|I braise] a nakonec ji [rozmixuju|I blend] na [hustou omáčku|thick sauce]. K tomu patří [knedlíky|dumplings], [brusinky|cranberries] a [šlehačka|whipped cream]. [Příprava|The preparation] [zabere|takes] skoro tři hodiny, ale [stojí to za to|it's worth it].",
    quiz:[
      { q:"Jaké jídlo autor vaří?", opts:["guláš","svíčkovou","polévku"], a:1, skill:"comprehension" },
      { q:"Co patří ke svíčkové?", opts:["rýže a salát","knedlíky, brusinky a šlehačka","chléb a sýr"], a:1, skill:"vocab-food" },
      { q:"Jak dlouho trvá příprava?", opts:["půl hodiny","skoro tři hodiny","celý den"], a:1, skill:"comprehension" },
      { q:"Doplň: „Příprava [...] skoro tři hodiny.“ (to take time)", opts:[], a:["zabere"], type:"fill", skill:"vocab-daily", explain:"<b>zabrat (čas)</b> = to take (time). „Zabere tři hodiny.“ = It takes three hours." }
    ]},
  { id:"b1-doktor", level:"B1", diff:5, titleCz:"U doktora", titleEn:"At the doctor's",
    text:"Už několik dní se [necítím dobře|I don't feel well]. Bolí mě [v krku|my throat] a mám [horečku|a fever]. Včera jsem se [objednal|made an appointment] k [lékaři|doctor]. V [čekárně|waiting room] jsem [čekal|waited] skoro hodinu. Pak mě [sestra|nurse] [zavolala|called] do [ordinace|surgery]. Doktor mě [vyšetřil|examined] a řekl, že mám [angínu|tonsillitis]. [Předepsal|He prescribed] mi [antibiotika|antibiotics] a [doporučil|recommended] [klid na lůžku|bed rest]. V [lékárně|pharmacy] jsem si [vyzvedl|picked up] léky a šel domů spát.",
    quiz:[
      { q:"Co autora bolí?", opts:["hlava","v krku","záda"], a:1, skill:"comprehension" },
      { q:"Co mu doktor předepsal?", opts:["vitamíny","antibiotika","nic"], a:1, skill:"vocab-daily" },
      { q:"Kam šel pro léky?", opts:["do obchodu","do lékárny","do nemocnice"], a:1, skill:"comprehension" },
      { q:"Doplň minulý čas: „Doktor mě [...].“ (vyšetřit)", opts:[], a:["vyšetřil"], type:"fill", skill:"past-tense", explain:"<b>vyšetřil</b> = examined. Participle -l (he) — the helper drops in the 3rd person." }
    ]},
  { id:"b1-ridicak", level:"B1", diff:6, titleCz:"Učím se řídit", titleEn:"Learning to drive",
    text:"V [pětatřiceti|at thirty-five] jsem se konečně [rozhodla|decided] [udělat si řidičák|to get my driving licence]. Vždycky jsem [jezdila|used to travel] [hromadnou dopravou|by public transport], ale teď to potřebuju kvůli práci. [Autoškola|Driving school] [není levná|isn't cheap] a [zkoušky|exams] jsou [náročné|demanding]. Nejvíc se bojím [parkování|parking] a [couvání|reversing]. Můj [instruktor|instructor] je [trpělivý|patient] a říká, že [chyby|mistakes] [patří k|are part of] učení. [Teorii|The theory] už [mám za sebou|I've got behind me], teď mě čeká [praktická zkouška|the practical test].",
    quiz:[
      { q:"Proč se autorka rozhodla pro řidičák?", opts:["kvůli zábavě","kvůli práci","kvůli rodině"], a:1, skill:"comprehension" },
      { q:"Co už má hotové? (pozor)", opts:["praktickou zkoušku","teorii","celý řidičák"], a:1, skill:"comprehension", trick:true, explain:"Trick: „Teorii už mám za sebou“ = the theory is done; the practical test is still ahead. Read which part is finished." },
      { q:"Čeho se bojí nejvíc?", opts:["rychlosti","parkování a couvání","instruktora"], a:1, skill:"vocab-daily" },
      { q:"Doplň: „Chyby [...] k učení.“ (set phrase)", opts:[], a:["patří"], type:"fill", skill:"vocab-idiom", explain:"<b>patřit k</b> = to be part of / belong to. „Chyby patří k učení.“ = Mistakes are part of learning." }
    ]},
  { id:"b1-zahrada", level:"B1", diff:7, titleCz:"Naše zahrádka", titleEn:"Our little garden",
    text:"Na [jaře|spring] jsme začali [pěstovat|to grow] vlastní [zeleninu|vegetables]. Máme malou [zahrádku|garden plot] za domem. [Zaseli jsme|We sowed] [ředkvičky|radishes], [saláty|lettuces] a [bylinky|herbs]. Každý den musíme [zalévat|water them], hlavně když je [sucho|dry]. [Plevel|Weeds] roste [rychleji|faster] než zelenina! [Trpělivost|Patience] se ale [vyplácí|pays off] — minulý týden jsme [sklidili|harvested] první [rajčata|tomatoes]. [Chutnají|They taste] mnohem [líp|better] než ty z obchodu.",
    quiz:[
      { q:"Kdy začali pěstovat zeleninu?", opts:["na podzim","na jaře","v zimě"], a:1, skill:"comprehension" },
      { q:"Co roste rychleji než zelenina?", opts:["bylinky","plevel","rajčata"], a:1, skill:"comprehension" },
      { q:"Jaká jsou domácí rajčata?", opts:["horší než z obchodu","chutnají mnohem líp","stejná"], a:1, skill:"vocab-daily" },
      { q:"Doplň: „Trpělivost se [...].“ (to pay off)", opts:[], a:["vyplácí"], type:"fill", skill:"vocab-idiom", explain:"<b>vyplácet se</b> = to pay off / be worth it." }
    ]},

  /* --- B2 --- */
  { id:"b2-zdravi", level:"B2", diff:3, titleCz:"Zdravý životní styl", titleEn:"A healthy lifestyle",
    text:"V posledních letech se [stále více lidí|more and more people] [zajímá o|takes an interest in] zdravý životní styl. [Někteří|Some] [propadnou|fall for] [módním dietám|fad diets], jiní [naopak|on the contrary] [tvrdí|claim], že [stačí|it's enough to use] [zdravý rozum|common sense]. [Odborníci|Experts] se [shodují|agree] na tom, že [klíčem|the key] je [rovnováha|balance] — [pestrá strava|a varied diet], [dostatek|enough] pohybu a [spánku|sleep]. [Není třeba|There's no need] [zcela|completely] [vyřadit|to cut out] [sladkosti|sweets], stačí je [omezit|to limit]. [Zázračné řešení|A miracle solution] [neexistuje|doesn't exist]; [záleží|it depends] hlavně na [vytrvalosti|perseverance].",
    quiz:[
      { q:"Na čem se odborníci shodují?", opts:["na zázračné dietě","že klíčem je rovnováha","že na ničem nezáleží"], a:1, skill:"comprehension" },
      { q:"Musíme úplně vyřadit sladkosti? (pozor)", opts:["ano, zcela","ne, stačí je omezit","jen v létě"], a:1, skill:"comprehension", trick:true, explain:"Trick: „Není třeba zcela vyřadit… stačí omezit.“ The text says limit, not eliminate. Watch the negation." },
      { q:"„Zázračné řešení“ znamená:", opts:["a daily routine","a miracle solution","an expensive diet"], a:1, skill:"vocab-abstract" },
      { q:"Doplň: „Klíčem je [...].“ (balance)", opts:[], a:["rovnováha"], type:"fill", skill:"vocab-abstract", explain:"<b>rovnováha</b> = balance / equilibrium." }
    ]},
  { id:"b2-tradice", level:"B2", diff:4, titleCz:"České Vánoce", titleEn:"Czech Christmas",
    text:"České [Vánoce|Christmas] mají [řadu|a number of] [zvyků|customs], které [cizince|foreigners] často [překvapí|surprise]. Dárky [nenosí|doesn't bring] Santa, ale [Ježíšek|Baby Jesus], kterého [nikdo nikdy neviděl|no one has ever seen]. [Štědrý den|Christmas Eve], [čtyřiadvacátého|the 24th of] prosince, je [vyvrcholením|the climax]. K večeři se [tradičně|traditionally] [podává|is served] [kapr|carp] s [bramborovým salátem|potato salad]. [Údajně|Allegedly] kdo [vydrží|holds out] do večeře [o hladu|without eating], [uvidí|will see] [zlaté prasátko|the golden piglet]. Po večeři se [rozbalují|are unwrapped] dárky [pod stromečkem|under the tree].",
    quiz:[
      { q:"Kdo nosí v Česku dárky?", opts:["Santa","Ježíšek","Děda Mráz"], a:1, skill:"comprehension" },
      { q:"Co se podává k štědrovečerní večeři?", opts:["krocan","kapr s bramborovým salátem","svíčková"], a:1, skill:"vocab-food" },
      { q:"„Údajně“ znamená:", opts:["certainly","allegedly","never"], a:1, skill:"vocab-abstract" },
      { q:"Doplň: „Štědrý den je [...] Vánoc.“ (the climax — instrumental)", opts:[], a:["vyvrcholením"], type:"fill", skill:"cases", explain:"<b>vyvrcholením</b> = the climax (instrumental after „je“). The -ím ending marks the instrumental here." }
    ]},
  { id:"b2-kariera", level:"B2", diff:5, titleCz:"Změna kariéry", titleEn:"A career change",
    text:"Ve [čtyřiceti|at forty] jsem [opustil|left] [dobře placené|well-paid] místo v bance a stal se [učitelem|a teacher]. [Spousta lidí|A lot of people] mě [považovala za blázna|thought I was crazy]. [Přiznávám|I admit], že [zpočátku|at first] to bylo [děsivé|terrifying] — [příjem|income] [klesl|dropped] [na polovinu|by half]. [Přesto|Nevertheless] [nelituju|I don't regret it]. Práce mě konečně [naplňuje|fulfils me] a ráno [vstávám|I get up] [s chutí|gladly]. [Peníze|Money] [nejsou všechno|aren't everything]; [zjistil jsem|I've found], že [smysl|meaning] je [důležitější|more important] než [vysoký plat|a high salary].",
    quiz:[
      { q:"Čím se autor stal?", opts:["bankéřem","učitelem","lékařem"], a:1, skill:"comprehension" },
      { q:"Lituje svého rozhodnutí? (pozor)", opts:["ano, velmi","ne, nelituje","nedokáže se rozhodnout"], a:1, skill:"comprehension", trick:true, explain:"Trick: „Přesto nelituju.“ Despite the lower income, he does NOT regret it. The word <b>přesto</b> (nevertheless) signals the turn." },
      { q:"„Příjem klesl na polovinu“ znamená:", opts:["income doubled","income dropped by half","income stayed the same"], a:1, skill:"vocab-abstract" },
      { q:"Doplň: „Smysl je [...] než vysoký plat.“ (more important)", opts:[], a:["důležitější"], type:"fill", skill:"vocab-daily", explain:"<b>důležitější</b> = more important (comparative of důležitý)." }
    ]},
  { id:"b2-mesta", level:"B2", diff:6, titleCz:"Praha očima turistů", titleEn:"Prague through tourists' eyes",
    text:"Praha [patří mezi|is among] [nejnavštěvovanější|the most visited] města Evropy. [Turisté|Tourists] [obdivují|admire] [Karlův most|Charles Bridge], [Pražský hrad|Prague Castle] a [orloj|the astronomical clock] na [Staroměstském náměstí|Old Town Square]. [Centrum|The centre] je ale v létě [přeplněné|overcrowded] a [místní|locals] se mu raději [vyhýbají|avoid]. [Mnozí|Many] [Pražané|Praguers] [tvrdí|claim], že [pravou|the real] Prahu [objevíte|you'll discover] [až|only] [mimo|outside] [vyšlapané trasy|the beaten track] — v [klidných|quiet] [čtvrtích|neighbourhoods], kavárnách a parcích, kam turisté [nezavítají|don't venture].",
    quiz:[
      { q:"Co turisté obdivují?", opts:["nákupní centra","Karlův most a Pražský hrad","sídliště"], a:1, skill:"comprehension" },
      { q:"Kde podle textu objevíte pravou Prahu? (pozor)", opts:["v centru u orloje","až mimo turistické trasy","jen v zimě"], a:1, skill:"comprehension", trick:true, explain:"Trick: „pravou Prahu objevíte až mimo vyšlapané trasy.“ The real Prague is OUTSIDE the tourist routes, not in the crowded centre." },
      { q:"„Místní se centru vyhýbají“ znamená:", opts:["locals love the centre","locals avoid the centre","locals live in the centre"], a:1, skill:"vocab-daily" },
      { q:"Doplň: „Praha patří [...] nejnavštěvovanější města.“ (among)", opts:[], a:["mezi"], type:"fill", skill:"cases", explain:"<b>patřit mezi</b> + accusative = to be among / rank among." }
    ]},
  { id:"b2-cteni", level:"B2", diff:7, titleCz:"Proč čteme méně", titleEn:"Why we read less",
    text:"[Statistiky|Statistics] [ukazují|show], že lidé čtou [čím dál méně|less and less] knih. [Na vině|To blame] [bývají|tend to be] [chytré telefony|smartphones], které nám [krájí|chop up] [pozornost|attention] na malé kousky. [Soustředit se|To concentrate] na [delší text|a longer text] je dnes pro mnohé [obtížné|difficult]. Někteří [odborníci|experts] [varují před|warn against] [ztrátou|the loss] [schopnosti|of the ability] [hlubokého čtení|of deep reading]. [Na druhou stranu|On the other hand] [audioknihy|audiobooks] a [e-čtečky|e-readers] [zpřístupnily|made accessible] literaturu [novým|new] [čtenářům|readers]. [Možná|Perhaps] [nečteme|we don't read] méně, ale [jinak|differently].",
    quiz:[
      { q:"Co podle textu krájí naši pozornost?", opts:["knihy","chytré telefony","audioknihy"], a:1, skill:"comprehension" },
      { q:"Čteme dnes podle závěru méně? (pozor)", opts:["ano, jednoznačně méně","možná ne — jen jinak","vůbec nečteme"], a:1, skill:"comprehension", trick:true, explain:"Trick: the closing line flips it — „Možná nečteme méně, ale jinak.“ Perhaps we read differently, not less. Read to the end." },
      { q:"„Na druhou stranu“ je:", opts:["a linking phrase: on the other hand","a place","a kind of book"], a:0, skill:"connectives" },
      { q:"Doplň: „Odborníci varují [...] ztrátou schopnosti.“ (against)", opts:[], a:["před"], type:"fill", skill:"cases", explain:"<b>varovat před</b> + instrumental = to warn against (something)." }
    ]},

  /* --- C1 --- */
  { id:"c1-vzdelani", level:"C1", diff:3, titleCz:"Smysl vzdělání", titleEn:"The purpose of education",
    text:"Už dlouho se [vede debata|a debate is held] o tom, [k čemu|what] vlastně [slouží|serves] vzdělání. [Zastánci|Advocates] [tradičního pojetí|of the traditional view] [zdůrazňují|emphasise] [předávání|the passing on] [znalostí|of knowledge]. [Kritici|Critics] [namítají|object], že škola [příliš|too much] [lpí na|clings to] [memorování|rote learning] a [opomíjí|neglects] [kritické myšlení|critical thinking]. Ve světě, kde jsou informace [na dosah|within reach] [jediného|of a single] [kliknutí|click], [ztrácí|loses] [pouhé|mere] [zapamatování|memorisation] [na významu|in significance]. [Skutečnou hodnotou|The real value] se stává [schopnost|the ability] [orientovat se|to find one's way] v [záplavě|a flood] [dat|of data] a [odlišit|to distinguish] [podstatné|the essential] [od nepodstatného|from the trivial].",
    quiz:[
      { q:"Co kritici tradiční škole vyčítají?", opts:["příliš mnoho kritického myšlení","že lpí na memorování a opomíjí kritické myšlení","že je zadarmo"], a:1, skill:"comprehension" },
      { q:"„Informace na dosah jediného kliknutí“ znamená:", opts:["information is expensive","information is one click away","information is hidden"], a:1, skill:"vocab-idiom" },
      { q:"Co se podle autora stává skutečnou hodnotou? (pozor)", opts:["zapamatování faktů","schopnost orientovat se v datech","rychlost psaní"], a:1, skill:"comprehension", trick:true, explain:"Trick: the author says mere memorisation LOSES value; the real value is the ability to navigate data. Don't pick the thing he downplays." },
      { q:"Doplň: „Odlišit podstatné [...] nepodstatného.“ (from)", opts:[], a:["od"], type:"fill", skill:"cases", explain:"<b>odlišit od</b> + genitive = to distinguish from." }
    ]},
  { id:"c1-klima", level:"C1", diff:4, titleCz:"Klimatická změna", titleEn:"Climate change",
    text:"[Klimatická změna|Climate change] [přestala být|has ceased to be] [vzdálenou hrozbou|a distant threat]. [Extrémní|Extreme] počasí — [vlny veder|heatwaves], [povodně|floods] i [sucha|droughts] — [zasahuje|affects] [stále více|ever more] regionů. [Vědci|Scientists] se [shodují|agree], že [hlavní příčinou|the main cause] je [lidská činnost|human activity]. [Přesto|Nevertheless] [část veřejnosti|part of the public] problém [bagatelizuje|plays down] nebo ho [zcela|entirely] [popírá|denies]. [Řešení|The solution] [vyžaduje|requires] [zásadní|fundamental] [proměnu|transformation] našeho [způsobu života|way of life], [což|which] je [nepohodlné|uncomfortable]. [Otázkou|The question] [zůstává|remains], [zda|whether] [budeme jednat|we will act] [včas|in time], nebo až tehdy, [když|when] [už bude pozdě|it's already too late].",
    quiz:[
      { q:"Co je podle vědců hlavní příčinou?", opts:["sluneční cykly","lidská činnost","náhoda"], a:1, skill:"comprehension" },
      { q:"„Bagatelizuje“ znamená:", opts:["plays it down","exaggerates","solves it"], a:0, skill:"vocab-abstract" },
      { q:"Jaký je postoj autora k nečinnosti? (pozor)", opts:["je v klidu","obává se, že budeme jednat až pozdě","problém popírá"], a:1, skill:"comprehension", trick:true, explain:"Trick: the closing question reveals his worry — will we act in time, or only when it's too late? He is NOT calm about it." },
      { q:"Doplň: „Otázkou zůstává, [...] budeme jednat včas.“ (whether)", opts:[], a:["zda"], type:"fill", skill:"grammar-clauses", explain:"<b>zda</b> = whether. Introduces an indirect yes/no question (synonym: jestli)." }
    ]},
  { id:"c1-media", level:"C1", diff:5, titleCz:"Doba dezinformací", titleEn:"The age of disinformation",
    text:"Žijeme v době, kdy je [stále těžší|increasingly hard] [rozeznat|to tell apart] [pravdu|truth] [od|from] [lži|a lie]. [Sociální sítě|Social networks] [umožňují|allow] [komukoli|anyone] [šířit|to spread] [zprávy|news], [aniž by|without] je kdokoli [ověřil|verifying them]. [Dezinformace|Disinformation] se [šíří|spreads] [rychleji|faster] než [jejich|their] [opravy|corrections], [protože|because] [pracuje s|it works on] [emocemi|emotions]. [Zdravá skepse|Healthy scepticism] je proto [na místě|appropriate], [ovšem|however] [přehnaná nedůvěra|excessive distrust] [vede k|leads to] [cynismu|cynicism]. [Klíčem|The key] [není|is not] [přestat věřit|to stop believing] [všemu|everything], [nýbrž|but rather] [naučit se|to learn] [ptát|to ask], [odkud|where] informace [pochází|comes from].",
    quiz:[
      { q:"Proč se dezinformace šíří rychleji než opravy?", opts:["jsou kratší","pracují s emocemi","jsou pravdivé"], a:1, skill:"comprehension" },
      { q:"Co je podle autora klíčem? (pozor)", opts:["přestat věřit všemu","naučit se ptát na zdroj","věřit jen sociálním sítím"], a:1, skill:"comprehension", trick:true, explain:"Trick: „Klíčem NENÍ přestat věřit všemu, NÝBRŽ naučit se ptát…“ The key is not total distrust, but asking where info comes from." },
      { q:"„Na místě“ zde znamená:", opts:["in a physical place","appropriate / warranted","on time"], a:1, skill:"vocab-idiom" },
      { q:"Doplň: „Klíčem není přestat věřit, [...] naučit se ptát.“ (but rather)", opts:[], a:["nýbrž"], type:"fill", skill:"connectives", explain:"<b>nýbrž</b> = but rather. Used after a negation to introduce the correction (formal register)." }
    ]},
  { id:"c1-stesti", level:"C1", diff:6, titleCz:"Co je štěstí", titleEn:"What is happiness",
    text:"[Štěstí|Happiness] [patří k|is among] [nejčastěji|the most often] [skloňovaným|discussed] slovům, [a přesto|and yet] ho umíme jen [těžko|hardly] [definovat|define]. [Reklama|Advertising] nám [vnucuje|forces on us] [představu|the notion], že štěstí se dá [koupit|be bought]. [Filozofové|Philosophers] [napříč staletími|across the centuries] [však|however] [tvrdí|claim] [opak|the opposite]: [pravé|true] [uspokojení|satisfaction] [pramení|stems] [ze|from] [vztahů|relationships], [smyslu|meaning] a [vděčnosti|gratitude]. [Paradoxně|Paradoxically] [čím usilovněji|the harder] štěstí [honíme|we chase], [tím více|the more] nám [uniká|it eludes us]. [Možná|Perhaps] proto [bývají|tend to be] [nejšťastnější|happiest] ti, kdo ho [nehledají|don't seek it] [za každou cenu|at any cost].",
    quiz:[
      { q:"Odkud podle filozofů pramení uspokojení?", opts:["z peněz a věcí","ze vztahů, smyslu a vděčnosti","z reklamy"], a:1, skill:"comprehension" },
      { q:"Co se stane, čím usilovněji štěstí honíme? (pozor)", opts:["tím víc ho máme","tím víc nám uniká","nic se nezmění"], a:1, skill:"comprehension", trick:true, explain:"Trick: the paradox — „čím usilovněji honíme, tím více uniká.“ Chasing it harder makes it slip away." },
      { q:"„Vnucuje nám představu“ znamená:", opts:["forces a notion on us","asks our opinion","proves a fact"], a:0, skill:"vocab-abstract" },
      { q:"Doplň: „Čím usilovněji honíme, [...] více uniká.“ (the … the)", opts:[], a:["tím"], type:"fill", skill:"grammar-clauses", explain:"<b>čím … tím</b> = the … the (e.g. the harder … the more). A fixed correlative pair." }
    ]},

  /* --- C2 --- */
  { id:"c2-cas", level:"C2", diff:1, titleCz:"Vnímání času", titleEn:"The perception of time",
    text:"[Čas|Time] [plyne|flows] pro každého [stejně|the same], a přece ho [vnímáme|we perceive] [nesmírně|immensely] [rozdílně|differently]. V dětství se léto [zdálo|seemed] [nekonečné|endless], [zatímco|whereas] v dospělosti nám roky [protékají mezi prsty|slip through our fingers]. [Psychologové|Psychologists] to [vysvětlují|explain] tím, že [mozek|the brain] [měří|measures] čas [podle|by] [množství|the amount] [nových podnětů|of new stimuli]. [Čím rutinnější|The more routine] život, [tím rychleji|the faster] [ubíhá|it passes]. [Snad|Perhaps] právě proto [lpíme na|we cling to] [zážitcích|experiences]: [každá|every] [novinka|novelty] [jako by|as if] [natahovala|stretched out] naši [subjektivní|subjective] [paměť|memory] a [vzdorovala|defied] [pomíjivosti|transience].",
    quiz:[
      { q:"Jak mozek podle psychologů měří čas?", opts:["podle hodin","podle množství nových podnětů","podle věku"], a:1, skill:"comprehension" },
      { q:"„Roky protékají mezi prsty“ je:", opts:["a literal description","an idiom: time slips away fast","a complaint about money"], a:1, skill:"vocab-idiom" },
      { q:"Proč rutinní život ubíhá rychleji? (pozor)", opts:["protože je nudný","protože mozek registruje málo nových podnětů","protože je opravdu kratší"], a:1, skill:"comprehension", trick:true, explain:"Trick: it's about perception, not real length — few new stimuli → brain marks less → it feels faster." },
      { q:"Doplň: „Čím rutinnější život, [...] rychleji ubíhá.“ (the … the)", opts:[], a:["tím"], type:"fill", skill:"grammar-clauses", explain:"<b>čím … tím</b> = the … the." }
    ]},
  { id:"c2-jazyk", level:"C2", diff:2, titleCz:"Jazyk a identita", titleEn:"Language and identity",
    text:"[Jazyk|Language] není [pouhým|a mere] [nástrojem|tool] [dorozumívání|of communication]; [utváří|it shapes] [způsob|the way], [jakým|in which] [vnímáme|we perceive] svět. Lidé, kteří [hovoří|speak] [více jazyky|several languages], často [popisují|describe] [pocit|the feeling], že s každým jazykem [jako by|as if] [měnili|they changed] [část|part] [své osobnosti|of their personality]. [Mateřština|The mother tongue] v sobě [nese|carries] [vrstvy|layers] [vzpomínek|of memories] a [citů|emotions], [které|which] se [do|into] [cizí řeči|a foreign tongue] [přeložit nedají|cannot be translated]. [Ztratit|To lose] jazyk tak [znamená|means] [ztratit|to lose] [kus|a piece] [sebe sama|of oneself] — a proto [bývá|tends to be] [boj|the struggle] [o|for] [zachování|the preservation] [menšinových jazyků|of minority languages] [tak|so] [vášnivý|passionate].",
    quiz:[
      { q:"Co podle textu jazyk utváří?", opts:["jen slovní zásobu","způsob, jakým vnímáme svět","pouze přízvuk"], a:1, skill:"comprehension" },
      { q:"Co znamená ztratit jazyk? (pozor)", opts:["ušetřit čas","ztratit kus sebe sama","naučit se jiný jazyk"], a:1, skill:"comprehension", trick:true, explain:"Trick: „Ztratit jazyk znamená ztratit kus sebe sama.“ It's framed as a loss of part of one's identity." },
      { q:"„Přeložit nedají“ znamená:", opts:["are easy to translate","cannot be translated","must be translated"], a:1, skill:"grammar-clauses", explain:"<b>dát se</b> + infinitive = can be (done). Negated: <b>nedají se přeložit</b> = cannot be translated." },
      { q:"Doplň: „Mateřština nese vrstvy [...] a citů.“ (of memories)", opts:[], a:["vzpomínek"], type:"fill", skill:"cases", explain:"<b>vzpomínek</b> = of memories (genitive plural after „vrstvy“)." }
    ]},
  { id:"c2-umeni", level:"C2", diff:3, titleCz:"Má umění cenu?", titleEn:"Does art have a price?",
    text:"[Otázka|The question], [zda|whether] má [umění|art] nějakou [měřitelnou hodnotu|measurable value], [provokuje|has provoked] [odjakživa|since time immemorial]. [Pro jedny|For some] je [obraz|a painting] [za miliony|worth millions] [dokladem|proof] [zrůdnosti|of the grotesqueness] [trhu|of the market], [pro druhé|for others] [oprávněným|a justified] [oceněním|recognition] [geniality|of genius]. [Pravda|The truth] je, že [umělecká hodnota|artistic value] [se vzpírá|resists] [jakémukoli|any] [vzorci|formula]. [Dílo|A work], [jež|which] jednu generaci [nechává chladnou|leaves cold], [může|may] další [zasáhnout|strike] [až do morku kostí|to the very core]. [Snad|Perhaps] právě v této [nepředvídatelnosti|unpredictability] [tkví|lies] [skutečná|the true] [síla|power] umění: [odmítá|it refuses] [být|to be] [zařazeno|categorised], [zváženo|weighed] a [zaplaceno|paid for].",
    quiz:[
      { q:"Čemu se podle autora umělecká hodnota vzpírá?", opts:["kritice","jakémukoli vzorci","veřejnosti"], a:1, skill:"comprehension" },
      { q:"„Zasáhnout až do morku kostí“ je:", opts:["an idiom: to affect deeply","a medical term","to ignore completely"], a:0, skill:"vocab-idiom" },
      { q:"V čem podle autora tkví síla umění? (pozor)", opts:["ve vysoké ceně","v jeho nepředvídatelnosti","ve slávě umělce"], a:1, skill:"comprehension", trick:true, explain:"Trick: the power lies in art's UNPREDICTABILITY — its refusal to be measured — not in its price." },
      { q:"Doplň: „Dílo, [...] jednu generaci nechává chladnou…“ (which — relative pronoun)", opts:[], a:["jež"], type:"fill", skill:"grammar-clauses", explain:"<b>jež</b> = which/that (relative pronoun, here neuter referring to „dílo“; formal alternative to „které“)." }
    ]},
  { id:"c2-pamet", level:"C2", diff:4, titleCz:"Paměť a nostalgie", titleEn:"Memory and nostalgia",
    text:"[Paměť|Memory] není [věrným|a faithful] [archivem|archive], [nýbrž|but rather] [tvořivým|a creative] [vypravěčem|storyteller]. [Pokaždé|Each time], když si [něco|something] [vybavíme|we recall], [vzpomínku|the memory] [nevědomky|unwittingly] [pozměníme|we alter]. [Nostalgie|Nostalgia] pak minulost [pozlacuje|gilds]: [obtíže|the hardships] [vyblednou|fade] a [zůstane|there remains] [zidealizovaný|an idealised] [obraz|image]. [Tento sklon|This tendency] [má svůj smysl|has its purpose]: [pomáhá nám|it helps us] [vyrovnat se|to come to terms] [se ztrátami|with losses] a [dodává|gives] životu [souvislost|coherence]. [Zároveň|At the same time] nás však [může klamat|may deceive us], [budí|it stirs] [touhu|a longing] [po|for] časech, [které|which] [ve skutečnosti|in reality] [nikdy|never] [neexistovaly|existed] [tak|as] [růžově|rosily], [jak|as] si je [malujeme|we paint them].",
    quiz:[
      { q:"Čím podle autora paměť je?", opts:["věrným archivem","tvořivým vypravěčem","přesným strojem"], a:1, skill:"comprehension" },
      { q:"Po čem nostalgie budí touhu? (pozor)", opts:["po reálné minulosti","po idealizovaných časech, jež tak neexistovaly","po budoucnosti"], a:1, skill:"comprehension", trick:true, explain:"Trick: nostalgia gilds the past — it longs for times that never really were as rosy as we paint them." },
      { q:"„Minulost pozlacuje“ znamená:", opts:["makes the past seem golden/idealised","erases the past","repeats the past"], a:0, skill:"vocab-idiom" },
      { q:"Doplň: „Paměť není věrným archivem, [...] tvořivým vypravěčem.“ (but rather)", opts:[], a:["nýbrž"], type:"fill", skill:"connectives", explain:"<b>nýbrž</b> = but rather (after a negation)." }
    ]},
  { id:"c2-svoboda", level:"C2", diff:5, titleCz:"Svoboda a odpovědnost", titleEn:"Freedom and responsibility",
    text:"[Svoboda|Freedom] [bývá|tends to be] [vnímána|perceived] jako [absence|the absence] [omezení|of restrictions], [jako by|as if] [znamenala|it meant] [moci|being able] dělat [cokoli|anything]. [Takové pojetí|Such a conception] je však [zavádějící|misleading]. [Skutečná|True] svoboda [se neobejde bez|cannot do without] [odpovědnosti|responsibility]: [každá|every] [volba|choice] [s sebou nese|carries with it] [důsledky|consequences], [za něž|for which] [neseme|we bear] [vinu i zásluhu|both blame and credit]. [Společnost|A society], [v níž|in which] si každý dělá, [co chce|what they want], [bez ohledu na|regardless of] [druhé|others], se [záhy|soon] [zhroutí|collapses]. [Paradoxně|Paradoxically] tak [nejvíce|the most] svobody [užívá|enjoys] ten, kdo [dokáže|is able] [své|his own] [touhy|desires] [dobrovolně|voluntarily] [podřídit|to subordinate] [vyššímu|to a higher] [smyslu|purpose].",
    quiz:[
      { q:"Bez čeho se podle autora svoboda neobejde?", opts:["bez peněz","bez odpovědnosti","bez pravidel státu"], a:1, skill:"comprehension" },
      { q:"Kdo podle autora užívá nejvíce svobody? (pozor)", opts:["kdo dělá, co chce","kdo umí své touhy podřídit vyššímu smyslu","nikdo"], a:1, skill:"comprehension", trick:true, explain:"Trick: the paradox — the freest person is the one who can voluntarily subordinate desires to a higher purpose, not the one who does whatever they want." },
      { q:"„Zavádějící“ znamená:", opts:["leading the way","misleading","liberating"], a:1, skill:"vocab-abstract" },
      { q:"Doplň: „Každá volba s sebou nese [...].“ (consequences)", opts:[], a:["důsledky"], type:"fill", skill:"vocab-abstract", explain:"<b>důsledky</b> = consequences (accusative plural here)." }
    ]}
];

/* Expose for the app (works as plain <script> include). */
window.SKILLS = SKILLS;
window.STORIES = STORIES;
