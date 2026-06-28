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
    ]}

  /* ===================== C2 ===================== */
  /* C2 stories will be added in the next content wave. */
];

/* Expose for the app (works as plain <script> include). */
window.SKILLS = SKILLS;
window.STORIES = STORIES;
