export interface PrayerSection {
  title: string;
  icon: string;
  latin: string;
  portuguese: string;
}

export interface MysterySubSection {
  title: string;
  icon: string;
  latin: string;
  portuguese: string;
  type?: 'offering' | 'prayer'; // to distinguish between mystery offering and individual prayers
}

export interface MysterySection {
  title: string;
  icon: string;
  offering: {
    latin: string;
    portuguese: string;
  };
  prayers: PrayerSection[]; // Individual prayer cards
}

export interface StandardRosarySection {
  title: string;
  subtitle: string;
  latin: string;
  sections: PrayerSection[];
}

export interface MysteryRosarySection {
  title: string;
  subtitle: string;
  latin: string;
  type: 'mystery';
  sections: MysterySection[];
}

export type RosarySection = StandardRosarySection | MysteryRosarySection;

export const rosaryContent: Record<string, any> = {
  initium: {
    title: "Prima Oratio",
    subtitle: "Orações iniciais",
    sections: [
      {
        title: "Signum Crucis",
        icon: "custom-signum-crucis",
        latin: `Per signum crucis de inimicis nostris libera nos Deus noster.<br>
                In nomine Patris, et Filii, et Spiritus Sancti.<br>
                Amen.`,
        portuguese: `Pelo sinal da Santa Cruz, livrai-nos Deus, Nosso Senhor, dos nossos inimigos.<br>
                     Em nome do Pai e do Filho e do Espírito Santo.<br>
                     Amém.`
      },
      {
        title: "Offertorium Rosarii",
        icon: "fas fa-gift",
        latin: `Divino Iesu, nos Tibi offerimus hoc rosarium, quod recitaturi sumus, mysteria nostrae Redemptionis meditantes. Concede nobis, per intercessionem Virginis Mariae, Dei Genetricis et Matris nostrae, virtutes quibus opus est ut digne illud recitemus, atque gratiam indulgentias huius sanctae devotionis obtinendi.<br><br>
                Particulariter offerimus in reparationem peccatorum contra Sacratissimum Cor Iesu et Immaculatum Cor Mariae commissorum, pro pace mundi, pro conversione peccatorum, pro animabus in Purgatorio, pro intentionibus Summi Pontificis, pro incremento et sanctificatione Cleri, pro reditu Cleri et fidelium ad traditionem, pro sanctificatione familiarum, pro missionibus, pro aegrotis, pro agonizantibus, pro omnibus qui preces nostras petierunt, pro patria nostra et pro omnibus intentionibus nostris particularibus.`,
        portuguese: `Divino Jesus, nós Vos oferecemos este terço que vamos rezar, meditando nos mistérios da Vossa Redenção. Concedei-nos, por intercessão da Virgem Maria, Mãe de Deus e nossa Mãe, as virtudes que nos são necessárias para bem rezá-lo e a graça de ganharmos as indulgências desta santa devoção.<br><br>
                     Oferecemos particularmente, em desagravo dos pecados cometidos contra o Santíssimo Coração de Jesus e Imaculado Coração de Maria, pela paz do mundo, pela conversão dos pecadores, pelas almas do Purgatório, pelas intenções do Santo Padre, pelo aumento e santificação do Clero, pelo retorno dos fiéis à tradição, pela santificação das famílias, pelas missões, pelos doentes, pelos agonizantes, por todos aqueles que pediram nossas orações, pelo nosso país e por todas as nossas intenções particulares.`
      },
      {
        title: "Oratio ad Angelum Custodem",
        icon: "custom-angel",
        latin: `Sancte Angele Custos, cum omni amore et fiducia, Te rogamus ut adsistas et juncti nobiscum hoc rosarium recites, ut orationes nostrae efficaciores sint et semper in unione cum Deo maneamus. Amen.`,
        portuguese: `Santo Anjo da Guarda, com todo amor e confiança, Vos pedimos para que estejais conosco rezando este terço, para que nossas orações sejam mais eficazes
e que estejamos sempre em união com Deus. Amém.`
      },
      {
        title: "Invocatio Sancti Spiritus",
        icon: "fas fa-dove",
        latin: `Veni, Sancte Spiritus, reple tuorum corda fidelium, et tui amoris in eis ignem accende.<br><br>
                V. Emítte Spíritum tuum, et creabúntur.<br>
                R. Et renovábis fáciem terrae.<br><br>
                Oremus: Deus qui corda fidélium Sancti Spíritus illustratióne docuísti: da nobis in eódem Spíritu recta sápere; et de ejus semper consolatióne gaudére.<br>
                Per Christum Dominum Nostrum. Amen.`,
        portuguese: `Vinde Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do Vosso amor.<br><br>
                     V. Enviai o Vosso Espírito e tudo será criado.<br>
                     R. E renovareis a face da terra.<br><br>
                     Oremos: Deus, que instruístes os corações dos vossos fiéis com a luz do Espírito Santo, concedei-nos que no mesmo Espírito conheçamos o que é reto, e gozemos sempre de suas consolações.<br>
                     Por Cristo, Nosso Senhor. Amém.`
      },
      {
        title: "Oratio pro Matrimonio et Filiis",
        icon: "fas fa-heart",
        latin: `Amate Iesu, Rex Regum, cor nostrum et vitam nostram amatoriam ante Te ponimus.<br>
                Dirige nos ad vivendum relationem secundum voluntatem Tuam, cum fidelitate, respectu et mutua donatione, ut sit via incrementi in fide et sanctitate.<br><br>
                Sancte Valentine, patrone veri amoris, intercede pro nobis et doce nos patienter alterius defectus accipere, virtutem veniae et comprehensionis colentes. Adiuva nos ad construendum amorem solidum, qui probationibus resistere possit et semper in Christo radicitus sit.<br><br>
                Gloriose Archangele Raphael, tu es fidelis dux eorum qui relationem secundum voluntatem Dei quaerunt. Nos in hoc itinere comitare, ducens nos ad aliquem qui vere Deum amet et sanctum matrimonium vivere velit. Illumina mentem nostram ut sapientes electiones faciamus, cor nostrum confirma ne fallamur amoribus transitoriis et doce nos patienter in Domino sperare.<br><br>
                Domine, si voluntas Tua est, concede nobis gratiam matrimonii, et para nos ad liberos quos nobis committere volueris cum gaudio recipiendos.<br>
                Ut a matris utero sani sint in corpore et anima, crescentes in amore Tuo et sub protectione Sacrae Familiae.<br><br>
                Sancte Ioseph, ora pro nobis!<br>
                Sancte Valentine, ora pro nobis!<br>
                Sancte Raphael, ora pro nobis!<br>
                Sacra Familia, protege nos!<br><br>
                Amen.`,
        portuguese: `Amado Jesus, Rei dos Reis, diante de Vós colocamos nossos corações e nossas vidas amorosas.<br>
                     Guiai-nos para viver um relacionamento conforme a Vossa vontade, com fidelidade, respeito e doação mútua, para que seja um caminho de crescimento na fé e na santidade.<br><br>
                     São Valentim, patrono do amor verdadeiro, intercedei por nós e ensinai-nos a aceitar com paciência as falhas um do outro, cultivando a virtude do perdão e da compreensão. Ajudai-nos a construir um amor sólido, capaz de resistir às provações e sempre enraizado em Cristo.<br><br>
                     Glorioso Arcanjo São Rafael, tu és o fiel guia dos que buscam um relacionamento segundo a vontade de Deus. Acompanhe-nos nessa jornada, conduzindo-nos a alguém que verdadeiramente ame a Deus e queira viver um santo matrimônio. Ilumina nossa mente para que façamos escolhas sábias, fortalecendo nosso coração para que não nos iludamos com amores passageiros e ensina-nos a esperar com paciência no Senhor.<br><br>
                     Senhor, se for da Vossa vontade, concedei-nos a graça do matrimônio, e preparai-nos para receber com alegria os filhos que nos quiserdes confiar.<br>
                     Que desde o ventre materno sejam saudáveis no corpo e na alma, crescendo no Vosso amor e sob a proteção da Sagrada Família.<br><br>
                     São José, rogai por nós.<br>
                     São Valentim, rogai por nós!<br>
                     São Rafael, rogai por nós!<br>
                     Sagrada Família, protegei-nos!<br><br>
                     Amém.`
      },
      {
        title: "Credo",
        icon: "fas fa-church",
        latin: `Credo in unum Deum, Patrem omnipoténtem, Factórem caeli et terrae, visibílium ómnium et invisibílium.<br>
                Et in unum Dóminum, Iesum Christum, Fílium Dei Unigénitum, et ex Patre natum ante ómnia saecula. Deum de Deo, lumen de lúmine, Deum verum de Deo vero, génitum, non factum, consubstantiálem Patri. Per quem ómnia facta sunt. Qui propter nos hómines, et propter nostram salútem, descéndit de caelis: Et incarnátus est de Spíritu Sancto, ex María Vírgine, et homo factus est. Crucifíxus étiam pro nobis sub Póntio Piláto; passus et sepúltus est. Et resurréxit tértia die, secúndum Scriptúras, et ascéndit in caelum, sedet ad déxteram Patris. Et íterum ventúrus est cum glória, iudicáre vivos et mórtuos, cuius regni non erit finis.<br>
                Et in Spíritum Sanctum, Dóminum et vivificántem, qui ex Patre Filióque procédit; Qui cum Patre et Fílio simul adorátur et conglorificátur: Qui locútus est per prophétas.<br>
                Et unam, sanctam, cathólicam et apostólicam Ecclésiam. Confíteor unum baptísma in remissiónem peccatorum. Et expecto resurrectionem mortuorum; Et vitam ventúri saeculi. Amen.`,
        portuguese: `Creio em um só Deus, Pai todo-poderoso, Criador do céu e da terra, de todas as coisas visíveis e invisíveis.<br>
                     Creio em um só Senhor, Jesus Cristo, Filho Unigénito de Deus, nascido do Pai antes de todos os séculos. Deus de Deus, luz da luz, Deus verdadeiro de Deus verdadeiro, gerado, não criado, consubstancial ao Pai. Por Ele todas as coisas foram feitas. E, por nós, homens, e para a nossa salvação, desceu dos céus: E se encarnou pelo Espírito Santo, no seio da Virgem Maria, e se fez homem. Também por nós foi crucificado sob Pôncio Pilatos; padeceu e foi sepultado. Ressuscitou ao terceiro dia, conforme as Escrituras, e subiu aos céus, onde está sentado à direita do Pai. De novo há-de vir em sua glória para julgar os vivos e os mortos; e o seu reino não terá fim.<br>
                     Creio no Espírito Santo, Senhor que dá a vida, e procede do Pai e do Filho; E com o Pai e o Filho é adorado e glorificado: Ele que falou pelos profetas.<br>
                     Creio na Igreja una, santa, católica e apostólica. Professo um só batismo para remissão dos pecados. Espero a ressurreição dos mortos; E a vida do mundo que há de vir. Amém.`
      },
      {
        title: "Pater Noster",
        icon: "custom-pater",
        latin: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`,
        portuguese: `Pai Nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos os nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
      },
      {
        title: "3 Ave Maria",
        icon: "custom-ave-maria",
        latin: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
        portuguese: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`
      },
      {
        title: "Gloria Patri",
        icon: "custom-gloria-patri",
        latin: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
        portuguese: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
      },
      {
        title: "Oratio Fatima",
        icon: "fas fa-star",
        latin: `Oh Iesu mi, nos absolvi a peccátis nostris, libera nos ab ignibus infernorum. Omnes animas attrahe ad caelum, praesertim habentes maximam necessitatem. Amen.`,
        portuguese: `Oh meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa divine Misericórdia. Amém.`
      }
    ]
  },
  gaudiosa: {
    title: "Mysteria Gaudiosa",
    subtitle: "Mistérios Gozosos",
    type: "mystery",
    sections: [
      {
        title: "I. Annuntiatio",
        icon: "fas fa-dove",
        offering: {
          latin: `Tibi offérimus, Domine Iésu, hanc decádem, in honórem Incarnatiónis tuæ in sínu Mariæ Virginis. A te pétimus, hoc mystério et intercessióne éius, profundam embrandos. Ámen.`,
          portuguese: `Nós Vos oferecemos, Senhor Jesus, esta primeira dezena para honrar a Vossa encarnação no seio da Virgem Maria: e Vos pedimos, por este mistério e por sua intercessão, uma profunda humildade. Amém.`
        },
        prayers: [
          {
            title: "Pater Noster",
            icon: "custom-pater",
            latin: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`,
            portuguese: `Pai Nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos os nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
          },
          {
            title: "10 Ave Maria",
            icon: "custom-ave-maria",
            latin: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
            portuguese: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`
          },
          {
            title: "Gloria Patri",
            icon: "custom-gloria-patri",
            latin: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
            portuguese: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
          },
          {
            title: "Oratio Fatima",
            icon: "fas fa-star",
            latin: `Oh Iesu mi, nos absolvi a peccátis nostris, libera nos ab ignibus infernorum. Omnes animas attrahe ad caelum, praesertim habentes maximam necessitatem. Amen.`,
            portuguese: `Oh meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa divine Misericórdia. Amém.`
          }
        ]
      },
      {
        title: "II. Visitatio",
        icon: "fas fa-baby",
        offering: {
          latin: `Tibi offérimus, Domine Iésu, hanc decádem, in honórem visitatiónis tuæ Sanctissime Matris ad Sanctam Elísabeth et sanctificatiónis Sancti Ioanni Baptístæ. A te pétimus, hoc mystério et intercessióne tuæ Sanctissimæ Matris, perféctam caritátem ad nostrum próximum. Ámen.`,
          portuguese: `Nós Vos oferecemos, Senhor Jesus, esta segunda dezena para honrar a visitação de vossa Santíssima Mãe a Santa Izabel e a santificação de São João Batista; e Vos pedimos, por este mistério e pela intercessão de Vossa Mãe Santíssima, a perfeita caridade para com o nosso próximo. Amém.`
        },
        prayers: [
          {
            title: "Pater Noster",
            icon: "custom-pater",
            latin: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`,
            portuguese: `Pai Nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos os nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
          },
          {
            title: "10 Ave Maria",
            icon: "custom-ave-maria",
            latin: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
            portuguese: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`
          },
          {
            title: "Gloria Patri",
            icon: "custom-gloria-patri",
            latin: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
            portuguese: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
          },
          {
            title: "Oratio Fatima",
            icon: "fas fa-star",
            latin: `Oh Iesu mi, nos absolvi a peccátis nostris, libera nos ab ignibus infernorum. Omnes animas attrahe ad caelum, praesertim habentes maximam necessitatem. Amen.`,
            portuguese: `Oh meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa divine Misericórdia. Amém.`
          }
        ]
      },
      {
        title: "III. Nativitas",
        icon: "fas fa-star",
        offering: {
          latin: `Tibi offérimus, Domine Iésu, hanc decádem in honórem tuæ sanctæ nativitátis in stábulo Bethlehém. A te pétimus, hoc mystério et embrando-se Tuæ Sanctissimæ Matris, abducére me bonórum mundi, despicátum divitiárum et amórem paupertátis. Ámen.`,
          portuguese: `Nós Vos oferecemos, Senhor Jesus, esta terceira dezena para honrar o Vosso Santo nascimento no estábulo de Belém; e Vos pedimos, por este mistério e pela intercessão de Vossa Mãe Santíssima, o desapego dos bens terrenos, o desprezo das riquezas e o amor à pobreza. Amém.`
        },
        prayers: [
          {
            title: "Pater Noster",
            icon: "custom-pater",
            latin: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`,
            portuguese: `Pai Nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos os nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
          },
          {
            title: "10 Ave Maria",
            icon: "custom-ave-maria",
            latin: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
            portuguese: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`
          },
          {
            title: "Gloria Patri",
            icon: "custom-gloria-patri",
            latin: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
            portuguese: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
          },
          {
            title: "Oratio Fatima",
            icon: "fas fa-star",
            latin: `Oh Iesu mi, nos absolvi a peccátis nostris, libera nos ab ignibus infernorum. Omnes animas attrahe ad caelum, praesertim habentes maximam necessitatem. Amen.`,
            portuguese: `Oh meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa divine Misericórdia. Amém.`
          }
        ]
      },
      {
        title: "IV. Praesentatio",
        icon: "fas fa-church",
        offering: {
          latin: `Tibi offérimus, Domine Iésu, hanc decádem, in honórem præsentatiónis tuæ in Templo et purificatiónis Beatæ Mariæ Virginis. A te pétimus, hoc mystério et intercessióne éius, mágnam puritátem ánimæ et córporis. Ámen.`,
          portuguese: `Nós Vos oferecemos, Senhor Jesus, esta quarta dezena para honrar a Vossa apresentação no templo e a purificação da Virgem Maria; e Vos pedimos, por este mistério e por sua intercessão uma grande pureza de corpo e de alma. Amém.`
        },
        prayers: [
          {
            title: "Pater Noster",
            icon: "custom-pater",
            latin: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`,
            portuguese: `Pai Nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos os nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
          },
          {
            title: "10 Ave Maria",
            icon: "custom-ave-maria",
            latin: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
            portuguese: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`
          },
          {
            title: "Gloria Patri",
            icon: "custom-gloria-patri",
            latin: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
            portuguese: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
          },
          {
            title: "Oratio Fatima",
            icon: "fas fa-star",
            latin: `Oh Iesu mi, nos absolvi a peccátis nostris, libera nos ab ignibus infernorum. Omnes animas attrahe ad caelum, praesertim habentes maximam necessitatem. Amen.`,
            portuguese: `Oh meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa divine Misericórdia. Amém.`
          }
        ]
      },
      {
        title: "V. Inventio in Templo",
        icon: "fas fa-search",
        offering: {
          latin: `Tibi offérimus, Domine Iésu, hanc decádem, in honórem inventiónis tuæ a Mariæ Virgine in medio doctórum. A te pétimus, hoc mystério et intercessióne éius, veram sapiéntiam. Ámen.`,
          portuguese: `Nós Vos oferecemos, Senhor Jesus, esta quinta dezena para honrar a Vossa perda no templo e reencontro pela Virgem Maria em meio aos doutores da lei, e Vos pedimos, por este mistério e por sua intercessão, a verdadeira sabedoria. Amém.`
        },
        prayers: [
          {
            title: "Pater Noster",
            icon: "custom-pater",
            latin: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`,
            portuguese: `Pai Nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos os nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
          },
          {
            title: "10 Ave Maria",
            icon: "custom-ave-maria",
            latin: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
            portuguese: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`
          },
          {
            title: "Gloria Patri",
            icon: "custom-gloria-patri",
            latin: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
            portuguese: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
          },
          {
            title: "Oratio Fatima",
            icon: "fas fa-star",
            latin: `Oh Iesu mi, nos absolvi a peccátis nostris, libera nos ab ignibus infernorum. Omnes animas attrahe ad caelum, praesertim habentes maximam necessitatem. Amen.`,
            portuguese: `Oh meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa divine Misericórdia. Amém.`
          }
        ]
      }
    ]
  },
  dolorosa: {
    title: "Mysteria Dolorosa",
    subtitle: "Mistérios Dolorosos",
    type: "mystery", 
    sections: [
      {
        title: "I. Agonia in Horto",
        icon: "fas fa-tree",
        offering: {
          latin: `Tibi offérimus, Domine Iésu, hanc decádem, in honórem Tuæ agoniæ mortális in hórto olivárum. A te pétimus, hoc mystério et intercessióne Tuæ Sanctissimæ Matris, contritiónis peccatórum nostrórum. Ámen.`,
          portuguese: `Nós Vos oferecemos, Senhor Jesus, esta primeira dezena para honrar a Tua agonia mortal no horto das oliveiras, e Vos pedimos, por este mistério e pela intercessão de Vossa Mãe Santíssima, a contrição de nossos pecados. Amém.`
        },
        prayers: [
          {
            title: "Pater Noster",
            icon: "custom-pater",
            latin: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`,
            portuguese: `Pai Nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos os nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
          },
          {
            title: "10 Ave Maria",
            icon: "custom-ave-maria",
            latin: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
            portuguese: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`
          },
          {
            title: "Gloria Patri",
            icon: "custom-gloria-patri",
            latin: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
            portuguese: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
          },
          {
            title: "Oratio Fatima",
            icon: "fas fa-star",
            latin: `Oh Iesu mi, nos absolvi a peccátis nostris, libera nos ab ignibus infernorum. Omnes animas attrahe ad caelum, praesertim habentes maximam necessitatem. Amen.`,
            portuguese: `Oh meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa divine Misericórdia. Amém.`
          }
        ]
      },
      {
        title: "II. Flagellatio",
        icon: "fas fa-cross",
        offering: {
          latin: `Tibi offérimus, Domine Iésu, hanc decádem in honórem Tuæ crudélis verberatiónis. A te pétimus, hoc mystério et intercessióne Tuæ Sanctissimæ Matris, plénam refrenatiónem nostrórum sénsuum. Ámen.`,
          portuguese: `Nós Vos oferecemos, Senhor Jesus, esta segunda dezena para honrar a Vossa cruel flagelação, e Vos pedimos, por este mistério e pela intercessão de Vossa Mãe Santíssima, a mortificação de nossos sentidos. Amém.`
        },
        prayers: [
          {
            title: "Pater Noster",
            icon: "custom-pater",
            latin: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`,
            portuguese: `Pai Nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos os nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
          },
          {
            title: "10 Ave Maria",
            icon: "custom-ave-maria",
            latin: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
            portuguese: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`
          },
          {
            title: "Gloria Patri",
            icon: "custom-gloria-patri",
            latin: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
            portuguese: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
          },
          {
            title: "Oratio Fatima",
            icon: "fas fa-star",
            latin: `Oh Iesu mi, nos absolvi a peccátis nostris, libera nos ab ignibus infernorum. Omnes animas attrahe ad caelum, praesertim habentes maximam necessitatem. Amen.`,
            portuguese: `Oh meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa divine Misericórdia. Amém.`
          }
        ]
      },
      {
        title: "III. Coronatio Spinis",
        icon: "custom-gloriosa",
        offering: {
          latin: `Tibi offérimus, Domine Iésu, hanc decádem, in honórem Tuæ crudélis coronatiónis spinórum. A te pétimus, hoc mystério et intercessióne Tuæ Sanctissimæ Matris, mágnam contemptiónem mundi. Ámen.`,
          portuguese: `Nós Vos oferecemos, Senhor Jesus, esta terceira dezena para honrar a vossa cruel coroação de espinhos, e Vos pedimos, por este mistério e pela intercessão de Vossa Mãe Santíssima, o desprezo do mundo. Amém.`
        },
        prayers: [
          {
            title: "Pater Noster",
            icon: "custom-pater",
            latin: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`,
            portuguese: `Pai Nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos os nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
          },
          {
            title: "10 Ave Maria",
            icon: "custom-ave-maria",
            latin: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
            portuguese: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`
          },
          {
            title: "Gloria Patri",
            icon: "custom-gloria-patri",
            latin: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
            portuguese: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
          },
          {
            title: "Oratio Fatima",
            icon: "fas fa-star",
            latin: `Oh Iesu mi, nos absolvi a peccátis nostris, libera nos ab ignibus infernorum. Omnes animas attrahe ad caelum, praesertim habentes maximam necessitatem. Amen.`,
            portuguese: `Oh meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa divine Misericórdia. Amém.`
          }
        ]
      },
      {
        title: "IV. Bajulatio Crucis",
        icon: "fas fa-cross",
        offering: {
          latin: `Tibi offérimus, Domine Iésu, hanc decádem, in honórem Tuæ itíneris oneráti cruce ad montem calvárium. A te pétimus, hoc mystério et intercessióne Tuæ Sanctissimæ Matris, mágnam patiéntiam in ómnibus nostris crúcibus. Ámen.`,
          portuguese: `Nós Vos oferecemos, Senhor Jesus, esta quarta dezena para honrar o carregamento da cruz até o monte Calvário, e Vos pedimos, por este mistério e pela intercessão de Vossa Mãe Santíssima, a paciência em todas as nossas cruzes. Amém.`
        },
        prayers: [
          {
            title: "Pater Noster",
            icon: "custom-pater",
            latin: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`,
            portuguese: `Pai Nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos os nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
          },
          {
            title: "10 Ave Maria",
            icon: "custom-ave-maria",
            latin: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
            portuguese: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`
          },
          {
            title: "Gloria Patri",
            icon: "custom-gloria-patri",
            latin: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
            portuguese: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
          },
          {
            title: "Oratio Fatima",
            icon: "fas fa-star",
            latin: `Oh Iesu mi, nos absolvi a peccátis nostris, libera nos ab ignibus infernorum. Omnes animas attrahe ad caelum, praesertim habentes maximam necessitatem. Amen.`,
            portuguese: `Oh meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa divine Misericórdia. Amém.`
          }
        ]
      },
      {
        title: "V. Crucifixio",
        icon: "fas fa-cross",
        offering: {
          latin: `Tibi offérimus, Domine Iésu, hanc decádem, in honórem Tuæ crucifixiónis et mórtis ignominiósæ in Mónte Calvário. A Te pétimus, hoc mystério et intercessióne Tuæ Sanctissimæ Matris, conversiónem peccatórum, perseverántiam iustórum et solácium animárum purgatórii. Ámen.`,
          portuguese: `Nós Vos oferecemos, Senhor Jesus, esta quinta dezena para honrar a vossa crucificação e morte ignominiosa no monte Calvário, e Vos pedimos, por este mistério e pela intercessão de Vossa Mãe Santíssima, a conversão dos pecadores, a perseverança dos justos e o alívio das almas do purgatório. Amém.`
        },
        prayers: [
          {
            title: "Pater Noster",
            icon: "custom-pater",
            latin: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`,
            portuguese: `Pai Nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos os nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
          },
          {
            title: "10 Ave Maria",
            icon: "custom-ave-maria",
            latin: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
            portuguese: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`
          },
          {
            title: "Gloria Patri",
            icon: "custom-gloria-patri",
            latin: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
            portuguese: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
          },
          {
            title: "Oratio Fatima",
            icon: "fas fa-star",
            latin: `Oh Iesu mi, nos absolvi a peccátis nostris, libera nos ab ignibus infernorum. Omnes animas attrahe ad caelum, praesertim habentes maximam necessitatem. Amen.`,
            portuguese: `Oh meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa divine Misericórdia. Amém.`
          }
        ]
      }
    ]
  },
  gloriosa: {
    title: "Mysteria Gloriosa",
    subtitle: "Mistérios Gloriosos",
    type: "mystery",
    sections: [
      {
        title: "I. Resurrectio",
        icon: "fas fa-cross",
        offering: {
          latin: `Tibi offérimus, Domine Iésu, hanc decádem, in honórem Tuæ gloriósæ resurretiónis. A Te pétimus, hoc mystério et intercessióne Tuæ Sanctissimæ Matris, amórem Dei et divínum ardórem Tui Sancti ministérii. Ámen.`,
          portuguese: `Nós Vos oferecemos, Senhor Jesus, esta primeira dezena para honrar a vossa gloriosa ressurreição, e Vos pedimos, por este mistério e pela intercessão de Vossa Mãe Santíssima, o amor a Deus e o fervor no Vosso serviço. Amém.`
        },
        prayers: [
          {
            title: "Pater Noster",
            icon: "custom-pater",
            latin: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`,
            portuguese: `Pai Nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos os nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
          },
          {
            title: "10 Ave Maria",
            icon: "custom-ave-maria",
            latin: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
            portuguese: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`
          },
          {
            title: "Gloria Patri",
            icon: "custom-gloria-patri",
            latin: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
            portuguese: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
          },
          {
            title: "Oratio Fatima",
            icon: "fas fa-star",
            latin: `Oh Iesu mi, nos absolvi a peccátis nostris, libera nos ab ignibus infernorum. Omnes animas attrahe ad caelum, praesertim habentes maximam necessitatem. Amen.`,
            portuguese: `Oh meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa divine Misericórdia. Amém.`
          }
        ]
      },
      {
        title: "II. Ascensio",
        icon: "fas fa-cloud",
        offering: {
          latin: `Tibi offérimus, Domine Iésu, hanc decádem, in honórem Tuæ ascentiónis triunphális in cælum. A Te pétimus, hoc mystério et intercessióne Tuæ Sanctissimæ Matris, férvidum desidérium cæli, nostræ diléctæ pátriæ. Ámen.`,
          portuguese: `Nós Vos oferecemos, Senhor Jesus, esta segunda dezena para honrar a Vossa triunfante ascenção, e Vos pedimos, por este mistério e pela intercessão de Vossa Mãe Santíssima, um ardente desejo do Céu, nossa querida pátria. Amém.`
        },
        prayers: [
          {
            title: "Pater Noster",
            icon: "custom-pater",
            latin: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`,
            portuguese: `Pai Nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos os nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
          },
          {
            title: "10 Ave Maria",
            icon: "custom-ave-maria",
            latin: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
            portuguese: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`
          },
          {
            title: "Gloria Patri",
            icon: "custom-gloria-patri",
            latin: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
            portuguese: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
          },
          {
            title: "Oratio Fatima",
            icon: "fas fa-star",
            latin: `Oh Iesu mi, nos absolvi a peccátis nostris, libera nos ab ignibus infernorum. Omnes animas attrahe ad caelum, praesertim habentes maximam necessitatem. Amen.`,
            portuguese: `Oh meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa divine Misericórdia. Amém.`
          }
        ]
      },
      {
        title: "III. Descensus Spiritus Sancti",
        icon: "fas fa-fire",
        offering: {
          latin: `Tibi offérimus, Domine Iésu, hanc decádem, in honórem mistérii Pentecóstes. A Te pétimus, hoc mystério et intercessióne Tuæ Sanctissimæ Matris, descénsum Spiritus Sancti in nostras animas. Ámen.`,
          portuguese: `Nós Vos oferecemos, Senhor Jesus, esta terceira dezena para honrar o mistério de Pentecostes, e Vos pedimos, por este mistério e pela intercessão de Vossa Mãe Santíssima, a descida do Espírito Santo em nossas almas. Amém.`
        },
        prayers: [
          {
            title: "Pater Noster",
            icon: "custom-pater",
            latin: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`,
            portuguese: `Pai Nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos os nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
          },
          {
            title: "10 Ave Maria",
            icon: "custom-ave-maria",
            latin: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
            portuguese: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`
          },
          {
            title: "Gloria Patri",
            icon: "custom-gloria-patri",
            latin: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
            portuguese: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
          },
          {
            title: "Oratio Fatima",
            icon: "fas fa-star",
            latin: `Oh Iesu mi, nos absolvi a peccátis nostris, libera nos ab ignibus infernorum. Omnes animas attrahe ad caelum, praesertim habentes maximam necessitatem. Amen.`,
            portuguese: `Oh meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa divine Misericórdia. Amém.`
          }
        ]
      },
      {
        title: "IV. Assumptio",
        icon: "fas fa-cloud-upload",
        offering: {
          latin: `Tibi offérimus, Domine Iésu, hanc decádem, in honórem ressurrectionis et triumphális assumptiónis Tuæ Sanctissimæ Matris in cælo. A Te pétimus, hoc mystério et intercessióne éius, téneram devotiónem erga tam bonam matrem. Ámen.`,
          portuguese: `Nós Vos oferecemos, Senhor Jesus, esta quarta dezena para honrar a ressurreição e triunfal assunção de Vossa Santíssima Mãe ao Céu, e Vos pedimos, por este mistério e por sua intercessão, uma terna devoção a tão boa Mãe. Amém.`
        },
        prayers: [
          {
            title: "Pater Noster",
            icon: "custom-pater",
            latin: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`,
            portuguese: `Pai Nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos os nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
          },
          {
            title: "10 Ave Maria",
            icon: "custom-ave-maria",
            latin: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
            portuguese: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`
          },
          {
            title: "Gloria Patri",
            icon: "custom-gloria-patri",
            latin: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
            portuguese: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
          },
          {
            title: "Oratio Fatima",
            icon: "fas fa-star",
            latin: `Oh Iesu mi, nos absolvi a peccátis nostris, libera nos ab ignibus infernorum. Omnes animas attrahe ad caelum, praesertim habentes maximam necessitatem. Amen.`,
            portuguese: `Oh meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa divine Misericórdia. Amém.`
          }
        ]
      },
      {
        title: "V. Coronatio",
        icon: "custom-gloriosa",
        offering: {
          latin: `Tibi offérimus, Domine Iésu, hanc decádem, in honórem corónæ inductiónis gloriæ Tuæ Sanctissimæ Matris in cælo. A Te pétimus, hoc mystério et intercessióne éius, perseverántiam in gratia et corónam gloriæ. Ámen.`,
          portuguese: `Nós Vos oferecemos, Senhor Jesus, esta quinta dezena para honrar a coroação gloriosa de Vossa Mãe Santíssima no Céu, e Vos pedimos, por este mistério e por sua intercessão, a perseverança na graça e a coroa da glória. Amém.`
        },
        prayers: [
          {
            title: "Pater Noster",
            icon: "custom-pater",
            latin: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie. Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`,
            portuguese: `Pai Nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos os nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
          },
          {
            title: "10 Ave Maria",
            icon: "custom-ave-maria",
            latin: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
            portuguese: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`
          },
          {
            title: "Gloria Patri",
            icon: "custom-gloria-patri",
            latin: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`,
            portuguese: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
          },
          {
            title: "Oratio Fatima",
            icon: "fas fa-star",
            latin: `Oh Iesu mi, nos absolvi a peccátis nostris, libera nos ab ignibus infernorum. Omnes animas attrahe ad caelum, praesertim habentes maximam necessitatem. Amen.`,
            portuguese: `Oh meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da Vossa divine Misericórdia. Amém.`
          }
        ]
      }
    ]
  },
  ultima: {
    title: "Ultima Oratio",
    subtitle: "Orações finais",
    sections: [
      {
        title: "Oratio Post Rosarium",
        icon: "custom-pater",
        latin: `Ave Maria, Filia dilectíssima Ætérni Pátris, Mater admirábilis Fílii, Sponsa fidelíssima Spiritus Sancti, Témplum Augústum Sanctissimæ Trinitátis. Ave, Filia Régis! Omnia tibi subiecta sunt in cælo et in terra. Ave, refúgium tutum peccatórum, Domina misericordiæ. Tu nunquam a te áliquem repéllis. Etiamsi peccátor coram te prosterno et te precor ut a tuo dilécto Filio Iésu obtíneas contritiónem veniamque omnium meórum peccatórum atque divinam sapiéntiam. Tibi ex tóto me dono et omnia mea. Te elígo, matrem Dominamque meam, ab hódie. Hábe me ínfimum tuórum filiórum et plus obædiéntem mancipiórum. Áudi suspirationis cordis mei quod vult te amáre et tibi fidéliter servíre. Non fiat ut ex omnibus illis qui ad te venerunt, ego non exáudiar. Oh spes mea! Oh vita mea! Oh fidélis et immaculáta Virgo Maria! Exáudi me, defénde me, nutri me, erúdi me et salva me. Amen.`,
        portuguese: `Eu Vos saúdo, Maria, Filha bem-amada do Eterno Pai, Mãe admirável do Filho, Esposa mui fiel do Espírito Santo, Templo augusto da Santíssima Trindade; eu Vos saúdo soberana princesa, a quem tudo está submisso no Céu e na terra; Eu vos saúdo, ó seguro refúgio dos pecadores, Nossa Senhora da Misericórdia, que jamais repelistes pessoa alguma. Pecador que sou, me prostro aos Vossos pés, e Vos peço de me obter de Jesus, vosso amado Filho, a contrição e o perdão de todos os meus pecados e a divina sabedoria. Eu me consagro todo a Vós, com tudo o que possuo. Eu Vos tomo hoje por minha mãe e Senhora. Tratai-me, pois, como o último de Vossos filhos e o mais obediente de Vossos escravos. Atendei, minha Princesa, atendei aos suspiros dum coração que deseja amar-Vos e servir-Vos fielmente. Que ninguém diga que, entre todos os que a Vós recorreram, seja eu o primeiro desamparado. Oh minha esperança, oh minha vida, oh minha fiel e Imaculada Virgem Maria, defendei-me, nutri-me, escutai-me, instruí-me, salvai-me. Amém.`
      },
      {
        title: "Salve Regina",
        icon: "custom-gloriosa",
        latin: `Salve, Regina, Mater misericordiae; vita, dulcedo, et spes nostra, salve. Ad te clamamus, exsules filii Hevae. Ad te suspiramus, gementes et flentes in hac lacrimarum valle. Eia ergo, Advocata nostra, illos tuos misericordes oculos ad nos converte; et Iesum, benedictum fructum ventris tui, nobis, post hoc exsilium ostende. O Clemente, o Pia, o Dulcis Virgo Maria. Ora pro nobis, Sancta Dei Genetrix. Ut digni efficiamur promissionibus Christi. Ámen.`,
        portuguese: `Salve Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva; a vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei; e depois deste desterro, mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria! Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém.`
      },
      {
        title: "Angelus",
        icon: "custom-angel",
        latin: `Angelus Domini nuntiavit Mariae.<br>
                R. Et concepit de Spiritu Sancto.<br><br>
                Ecce ancilla Domini.<br>
                R. Fiat mihi secundum verbum tuum.<br><br>
                Et Verbum caro factum est.<br>
                R. Et habitavit in nobis.<br><br>
                Oremus.<br>
                Gratiam tuam, quaesumus, Domine, mentibus nostris infunde; ut qui, Angelo nuntiante, Christi Filii tui incarnationem cognovimus, per passionem eius et crucem ad resurrectionis gloriam perducamur.<br><br>
                Ámen.`,
        portuguese: `O Anjo do Senhor anunciou a Maria.<br>
                     R. E ela concebeu do Espírito Santo.<br><br>
                     Eis aqui a serva do Senhor.<br>
                     R. Faça-se em mim segundo a Vossa palavra.<br><br>
                     E o Verbo se fez carne.<br>
                     R. E habitou entre nós.<br><br>
                     Oremos.<br>
                     Infundi, Senhor, em nossos corações a Vossa graça, Vo-lo suplicamos, a fim de que, conhecendo a anunciação do Anjo e a encarnação de Jesus Cristo, Vosso Filho, pelos merecimentos de sua paixão e morte, cheguemos à glória da ressurreição.<br><br>
                     Amém.`
      },
      {
        title: "Regina Coeli",
        icon: "custom-gloriosa",
        latin: `V. Regina caeli, laetare, alleluia.<br>
                R. Quia quem meruisti portare, alleluia.<br><br>
                V. Resurrexit, sicut dixit, alleluia.<br>
                R. Ora pro nobis Deum, alleluia.<br><br>
                V. Gaude et laetare, Virgo Maria, alleluia.<br>
                R. Quia surrexit Dominus vere, alleluia.<br><br>
                Oremus.<br>
                Deus, qui per resurrectionem Filii tui, Domini nostri Iesu Christi, mundum laetificare dignatus es: praesta, quaesumus; ut per eius Genetricem Virginem Mariam, perpetuae capiamus gaudia vitae. Per eundem Christum Dominum nostrum.<br><br>
                Ámen.`,
        portuguese: `V. Rainha do Céu, alegrai-vos, aleluia!<br>
                     R. Porque Aquele que merecestes trazer em Vosso ventre, aleluia!<br><br>
                     V. Ressuscitou como disse, aleluia!<br>
                     R. Rogai por nós a Deus, aleluia!<br><br>
                     V. Alegrai-vos e exultai, ó Virgem Maria, aleluia!<br>
                     R. Porque o Senhor ressuscitou verdadeiramente, aleluia!<br><br>
                     Oremos.<br>
                     Ó Deus, que Vos dignastes alegrar o mundo com a Ressurreição do vosso Filho, Nosso Senhor Jesus Cristo, concedei-nos, Vos suplicamos, que pela intercessão da Virgem Maria, Sua Mãe, a glória da vida eterna.<br><br>
                     Pelo mesmo Cristo Nosso Senhor.<br><br>
                     Amén.`
      },
      {
        title: "Oremus",
        icon: "fas fa-pray",
        latin: `Deus, cuius Unigenitus per vitam, mortem et resurrectionem suam nobis salutis aeternae praemia comparavit: concede, quaesumus; ut haec mysteria sacratissimi Rosarii beatae Mariae Virginis recolentes, et imitemur quod continent, et quod promittunt assequamur. Per eundem Christum Dominum Nostrum. Amen.`,
        portuguese: `Ó Deus, cujo Filho Unigénito, por Sua vida, morte e ressurreição, nos obteve as recompensas da vida eterna, concedei-nos, nós vos suplicamos, que, meditando estes mistérios do Santíssimo Rosário da Bem-Aventurada Virgem Maria, imitemos o que eles contêm e obtenhamos o que prometem, pelo mesmo Cristo Nosso Senhor. Amém.`
      },
      {
        title: "Signum Crucis",
        icon: "custom-signum-crucis",
        latin: `Per signum crucis, de inimicis nostris libera-nos Deus noster.<br>
                In nómine Pátris, et Fílii, et Spíritus Sáncti.<br>
                Amen.`,
        portuguese: `Pelo sinal da Santa Cruz, livrai-nos, Deus, Nosso Senhor, dos nossos inimigos.<br>
                     Em nome do Pai e do Filho e do Espírito Santo.<br>
                     Amém.`
      }
    ]
  }
};
