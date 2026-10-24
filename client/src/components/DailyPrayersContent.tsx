import { useState, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFontSize } from "@/hooks/useFontSize";
import { useIsMobile } from "@/hooks/use-mobile";

type PrayerTime = "morning" | "night";
type LiturgicalSeason = "ordinary" | "advent" | "septuagesima" | "lent" | "passion" | "easter";

const seasons: { value: LiturgicalSeason; label: string }[] = [
  { value: "ordinary", label: "Durante o ano" },
  { value: "advent", label: "Advento" },
  { value: "septuagesima", label: "Septuagésima" },
  { value: "lent", label: "Quaresma" },
  { value: "passion", label: "Tempo da Paixão" },
  { value: "easter", label: "Tempo Pascal" },
];

const shortLessons: Record<LiturgicalSeason, string> = {
  ordinary: "Dirija o Senhor nossos corações e nossos corpos, no amor de Deus e na paciência do Cristo.",
  advent: "Tende piedade de nós, Senhor, porque por Vós esperamos; seja vosso braço o nosso sustentáculo, desde a manhã, e nosso auxílio no momento da tribulação.",
  septuagesima: "Dirija o Senhor nossos corações e nossos corpos, no amor de Deus e na paciência do Cristo.",
  lent: "Procurai o Senhor, enquanto é possível achá-Lo; invocai-O enquanto está perto.",
  passion: "Não desviei minha face dos que me injuriavam e cuspiram em mim. O Senhor Deus é meu auxílio, e por isso jamais serei confundido.",
  easter: "Se ressuscitastes com o Cristo, procurai as coisas do alto, onde o Cristo está assentado à direita de Deus. Desejai as coisas do céu e não as que estão sobre a terra.",
};

function PrayerBlock({
  title,
  children,
  textClassName,
  note,
}: {
  title: string;
  children: ReactNode;
  textClassName: string;
  note?: string;
}) {
  return (
    <Card className="sacred-content-card rounded-2xl sacred-border animate-fade-in-up">
      <CardContent className="p-5 sm:p-7">
        <div className="text-center mb-5">
          <h3 className="font-cinzel text-lg sm:text-xl font-medium text-ancient-gold sacred-header-glow">
            {title}
          </h3>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent mx-auto mt-3 rounded-full" />
        </div>
        <div className={`prayer-content font-crimson text-parchment text-justify leading-relaxed space-y-3 ${textClassName}`}>
          {children}
        </div>
        {note && (
          <p className="mt-5 pt-4 border-t border-ancient-gold/20 text-xs sm:text-sm text-parchment/60 font-inter leading-relaxed">
            {note}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function Response({ children, kind = "V." }: { children: ReactNode; kind?: "V." | "R." }) {
  return (
    <p>
      <span className="font-semibold text-ancient-gold">{kind}</span>{" "}
      {children}
    </p>
  );
}

function AngelusText() {
  return (
    <>
      <p><span className="font-semibold text-ancient-gold">V.</span> O Anjo do Senhor anunciou a Maria.</p>
      <p><span className="font-semibold text-ancient-gold">R.</span> E ela concebeu por obra do Espírito Santo.</p>
      <p className="italic">Ave, Maria...</p>
      <p><span className="font-semibold text-ancient-gold">V.</span> Eis aqui a serva do Senhor.</p>
      <p><span className="font-semibold text-ancient-gold">R.</span> Faça-se em mim segundo a vossa palavra.</p>
      <p className="italic">Ave, Maria...</p>
      <p><span className="font-semibold text-ancient-gold">V.</span> E o Verbo se fez Carne.</p>
      <p><span className="font-semibold text-ancient-gold">R.</span> E habitou entre nós.</p>
      <p className="italic">Ave, Maria...</p>
      <p><span className="font-semibold text-ancient-gold">V.</span> Rogai por nós, Santa Mãe de Deus.</p>
      <p><span className="font-semibold text-ancient-gold">R.</span> Para que sejamos dignos das promessas do Cristo.</p>
      <p><span className="font-semibold text-ancient-gold">Oremos.</span> Infundi, Senhor, em nossas almas a vossa graça, para que nós, que conhecemos pela anunciação do Anjo a Encarnação de Jesus Cristo, vosso Filho, cheguemos por sua Paixão e Cruz à glória da Ressurreição. Pelo mesmo Jesus Cristo, Senhor nosso.</p>
      <Response kind="R.">Amém.</Response>
    </>
  );
}

function ReginaCaeliText() {
  return (
    <>
      <p>Rainha dos céus, alegrai-vos, aleluia!</p>
      <p>Porque Aquele que merecestes trazer em vosso seio, aleluia,</p>
      <p>Ressuscitou como disse, aleluia!</p>
      <p>Rogai a Deus por nós, aleluia!</p>
      <Response>Regozijai-vos e alegrai-vos, ó Virgem Maria, aleluia!</Response>
      <Response kind="R.">Porque o Senhor ressuscitou verdadeiramente, aleluia!</Response>
      <p><span className="font-semibold text-ancient-gold">Oremos.</span> Ó Deus, que Vos dignastes alegrar o mundo com a Ressurreição de vosso Filho, Nosso Senhor Jesus Cristo, concedei-nos que, por sua Santa Mãe, a Virgem Maria, alcancemos os inefáveis gozos da vida eterna. Pelo mesmo Jesus Cristo, Senhor nosso.</p>
      <Response kind="R.">Amém.</Response>
    </>
  );
}

export default function DailyPrayersContent() {
  const [prayerTime, setPrayerTime] = useState<PrayerTime>("morning");
  const [season, setSeason] = useState<LiturgicalSeason>("ordinary");
  const { getFontSizeClass, getLineHeightClass, getLetterSpacingClass } = useFontSize();
  const isMobile = useIsMobile();
  const textClassName = `${getFontSizeClass()} ${getLineHeightClass()} ${getLetterSpacingClass()}`;
  const mainContainerClass = `animate-fade-in relative px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 main-content ${!isMobile ? "ml-96" : "mobile-container pt-2"}`;
  const paschalTime = season === "easter";
  const penitentialSeason = ["septuagesima", "lent", "passion"].includes(season);

  return (
    <main className={mainContainerClass}>
      <div className="max-w-4xl mx-auto space-y-6 pb-28">
        <header className="text-center pt-5 sm:pt-8 pb-2">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-ancient-gold text-xl">✠</span>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-semibold text-ancient-gold sacred-header-glow">
              Orações Cotidianas
            </h1>
            <span className="text-ancient-gold text-xl">✠</span>
          </div>
          <p className="font-inter text-sm sm:text-base text-parchment/70">
            Prima e Completas — Missal Quotidiano de Dom Beda Keckeisen, O.S.B.
          </p>
          <p className="font-inter text-xs text-parchment/50 mt-1">Texto organizado a partir da transcrição da edição enviada</p>
        </header>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="ghost"
            aria-pressed={prayerTime === "morning"}
            onClick={() => setPrayerTime("morning")}
            className={`h-auto min-h-16 rounded-xl border px-3 py-3 flex flex-col gap-1 ${prayerTime === "morning" ? "border-ancient-gold/60 bg-ancient-gold/15 text-ancient-gold" : "border-ancient-gold/20 text-parchment/70 hover:bg-ancient-gold/10"}`}
          >
            <i className="fas fa-sun text-lg" aria-hidden="true" />
            <span className="font-cinzel text-sm sm:text-base">Oração da Manhã</span>
            <span className="font-inter text-xs opacity-80">Prima</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            aria-pressed={prayerTime === "night"}
            onClick={() => setPrayerTime("night")}
            className={`h-auto min-h-16 rounded-xl border px-3 py-3 flex flex-col gap-1 ${prayerTime === "night" ? "border-ancient-gold/60 bg-ancient-gold/15 text-ancient-gold" : "border-ancient-gold/20 text-parchment/70 hover:bg-ancient-gold/10"}`}
          >
            <i className="fas fa-moon text-lg" aria-hidden="true" />
            <span className="font-cinzel text-sm sm:text-base">Oração da Noite</span>
            <span className="font-inter text-xs opacity-80">Completas</span>
          </Button>
        </div>

        <Card className="sacred-content-card rounded-xl sacred-border">
          <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-x-5 sm:gap-y-3 sm:p-5 lg:grid-cols-[auto_minmax(220px,1fr)_minmax(220px,0.9fr)]">
            <label htmlFor="daily-prayer-season" className="font-cinzel text-sm uppercase tracking-wide text-ancient-gold sm:whitespace-nowrap">
              Tempo litúrgico
            </label>
            <Select
              value={season}
              onValueChange={(value) => setSeason(value as LiturgicalSeason)}
            >
              <SelectTrigger
                id="daily-prayer-season"
                aria-label="Tempo litúrgico"
                className="h-11 w-full rounded-xl border border-ancient-gold/35 bg-cathedral-dark text-sm text-parchment shadow-inner shadow-black/20 transition-colors hover:border-ancient-gold/60 focus:ring-2 focus:ring-ancient-gold/40 focus:ring-offset-0 focus:ring-offset-transparent [&>span]:text-parchment"
              >
                <SelectValue placeholder="Escolha o tempo litúrgico" />
              </SelectTrigger>
              <SelectContent className="z-[100] rounded-xl border border-ancient-gold/35 bg-cathedral-dark text-parchment shadow-xl shadow-black/40">
                {seasons.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="cursor-pointer rounded-lg py-2.5 text-sm text-parchment focus:bg-ancient-gold/15 focus:text-ancient-gold data-[highlighted]:bg-ancient-gold/15 data-[highlighted]:text-ancient-gold"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="font-inter text-xs leading-relaxed text-parchment/60 sm:col-span-2 lg:col-span-1">
              A seleção ajusta a lição breve da Prima e escolhe a antífona mariana pascal. Defina conforme o calendário litúrgico tradicional.
            </p>
          </CardContent>
        </Card>

        {prayerTime === "morning" ? (
          <>
            <PrayerBlock title="Orações iniciais" textClassName={textClassName}>
              <p>Em nome do Padre, e do Filho, e do Espírito Santo. Amém.</p>
              <p><span className="font-semibold text-ancient-gold">Padre nosso.</span> Padre nosso, que estais nos céus, santificado seja o vosso Nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje. Perdoai-nos as nossas dívidas, assim como nós perdoamos aos nossos devedores. E não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.</p>
              <p><span className="font-semibold text-ancient-gold">Ave, Maria.</span> Ave, Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto de vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora de nossa morte. Amém.</p>
              <p><span className="font-semibold text-ancient-gold">Creio em Deus.</span> Creio em Deus Padre, todo-poderoso, Criador do céu e da terra. E em Jesus Cristo, um só seu Filho, Nosso Senhor, o qual foi concebido do Espírito Santo; nasceu de Maria Virgem; padeceu sob o poder de Pôncio Pilatos; foi crucificado, morto e sepultado; desceu aos infernos; ao terceiro dia ressurgiu dos mortos; subiu aos céus; está assentado à mão direita de Deus Padre, todo-poderoso, de onde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo; na Santa Igreja Católica; na comunhão dos Santos; na remissão dos pecados; na ressurreição da carne; na vida eterna. Amém.</p>
            </PrayerBlock>

            <PrayerBlock title="Invocação e hino da Prima" textClassName={textClassName}>
              <Response kind="V.">Ó Deus, vinde em meu auxílio.</Response>
              <Response kind="R.">Senhor, apressai-Vos em me socorrer.</Response>
              <p>Glória ao Padre, e ao Filho, e ao Espírito Santo. Assim como era no princípio, agora e sempre, e por todos os séculos dos séculos. Amém. {penitentialSeason ? "Louvor a Vós, Senhor, Rei da eterna glória." : "Aleluia."}</p>
              <p className="font-semibold text-ancient-gold">Hino</p>
              <p>Já desponta o astro do dia; imploremos a Deus de joelhos. Peçamos-Lhe que nos atos deste dia nos preserve de todo o mal!</p>
              <p>Ponha um freio à nossa língua, para nos guardar do horror das discórdias! Cubra os nossos olhos, como com um véu, para que não se comprazam nas vaidades.</p>
              <p>Guarde-nos bem puro o íntimo do coração, e afaste de nós as seduções deste mundo. E o orgulho de nossa carne seja dominado pela abstinência e pela sobriedade.</p>
              <p>Assim, quando o dia chegar ao seu declínio, e o curso do tempo trouxer ainda a noite, conservados puros por nossa vida mortificada, cantaremos, de novo, um hino à sua glória.</p>
              <p>Glória a Deus Padre, glória ao seu Filho Unigênito, glória ao Espírito Consolador, agora e por todos os séculos. Amém.</p>
            </PrayerBlock>

            <PrayerBlock title="Capítulo e responsório breve" textClassName={textClassName}>
              <p>Ao Rei dos séculos, imortal e invisível, ao Deus único, honra e glória pelos séculos. Amém.</p>
              <Response kind="R.">Demos graças a Deus.</Response>
              <p><span className="font-semibold text-ancient-gold">V.</span> Cristo, Filho de Deus vivo, tende piedade de nós.</p>
              <p><span className="font-semibold text-ancient-gold">R.</span> Cristo, Filho de Deus vivo, tende piedade de nós.</p>
              <p><span className="font-semibold text-ancient-gold">V.</span> Vós, que estais assentado à mão direita do Pai.</p>
              <p><span className="font-semibold text-ancient-gold">R.</span> Tende piedade de nós.</p>
              <p><span className="font-semibold text-ancient-gold">V.</span> Glória ao Padre, e ao Filho, e ao Espírito Santo.</p>
              <p><span className="font-semibold text-ancient-gold">R.</span> Cristo, Filho de Deus vivo, tende piedade de nós.</p>
              <p><span className="font-semibold text-ancient-gold">V.</span> Erguei-Vos, ó Cristo, e socorrei-nos.</p>
              <p><span className="font-semibold text-ancient-gold">R.</span> Resgatai-nos por amor de vosso Nome.</p>
              <Response kind="V.">Senhor, ouvi a minha oração.</Response>
              <Response kind="R.">E o meu clamor chegue até Vós.</Response>
              <p><span className="font-semibold text-ancient-gold">Oremos.</span> Senhor, Deus onipotente, que nos fizestes chegar ao começo deste dia, salvai-nos hoje por vosso poder, a fim de que, no curso deste dia, não nos deixeis cair em algum pecado, mas sempre nossos pensamentos, palavras e ações se dirijam ao cumprimento de vossa justiça. Por Nosso Senhor Jesus Cristo, vosso Filho, que, sendo Deus, convosco vive e reina, em união com o Espírito Santo, por todos os séculos dos séculos.</p>
              <Response kind="R.">Amém.</Response>
            </PrayerBlock>

            <PrayerBlock title="Conclusão da Prima" textClassName={textClassName}>
              <Response kind="V.">Bendigamos ao Senhor.</Response>
              <Response kind="R.">Demos graças a Deus.</Response>
              <p className="text-sm italic text-parchment/70">Neste ponto, nas catedrais e nos mosteiros, lê-se o martirológio. Podem ser mencionados, segundo o calendário, a festa do dia e os Santos dos quais se faz memória. Em seguida continua-se:</p>
              <Response kind="V.">Preciosa na presença do Senhor.</Response>
              <Response kind="R.">É a morte de seus Santos.</Response>
              <p>A Santa Virgem Maria e todos os Santos intercedam por nós ao Senhor, a fim de que mereçamos ser ajudados e salvos por Aquele que vive e reina pelos séculos. Amém.</p>
              <p><span className="font-semibold text-ancient-gold">V.</span> Ó Deus, vinde em meu auxílio. <span className="font-semibold text-ancient-gold">R.</span> Senhor, apressai-Vos em me socorrer.</p>
              <p className="text-sm italic text-parchment/70">Repete-se três vezes este versículo e acrescenta-se:</p>
              <p>Glória ao Padre, e ao Filho, e ao Espírito Santo. Assim como era no princípio, agora e sempre, e por todos os séculos dos séculos. Amém.</p>
              <Response kind="V.">Senhor, tende piedade de nós.</Response>
              <Response kind="R.">Cristo, tende piedade de nós.</Response>
              <Response kind="R.">Senhor, tende piedade de nós.</Response>
              <p><span className="font-semibold text-ancient-gold">V.</span> Padre nosso (em voz baixa).</p>
              <Response kind="V.">E não nos deixeis cair em tentação.</Response>
              <Response kind="R.">Mas livrai-nos do mal.</Response>
              <p><span className="font-semibold text-ancient-gold">V.</span> Volvei, Senhor, os vossos olhos para vossos servos e para vossa obra, e dirigi os seus filhos.</p>
              <p><span className="font-semibold text-ancient-gold">R.</span> E a vossa indulgência, Senhor, nosso Deus, descanse sobre nós; dirigi, do alto, as obras de nossas mãos; dirigi o trabalho de nossas mãos.</p>
              <p><span className="font-semibold text-ancient-gold">V.</span> Glória ao Padre, e ao Filho, e ao Espírito Santo.</p>
              <p><span className="font-semibold text-ancient-gold">R.</span> Assim como era no princípio, agora e sempre, e por todos os séculos dos séculos. Amém.</p>
              <p><span className="font-semibold text-ancient-gold">Oremos.</span> Dignai-Vos, Senhor Deus, Rei do céu e da terra, dirigir, santificar, reger e governar, neste dia, nossos corações e nossos corpos, nossos sentidos, palavras e obras, segundo vossa lei e no cumprimento de vossos preceitos, a fim de que, aqui na terra e na eternidade, mereçamos, por vosso auxílio, obter a salvação e a liberdade, ó Salvador do mundo, que viveis e reinais pelos séculos.</p>
              <Response kind="R.">Amém.</Response>
              <p><span className="font-semibold text-ancient-gold">V.</span> O Senhor onipotente disponha em sua paz nossos dias e nossos atos.</p>
              <Response kind="R.">Amém.</Response>
            </PrayerBlock>

            <PrayerBlock title="Lição breve conforme o tempo litúrgico" textClassName={textClassName}>
              <p>{shortLessons[season]}</p>
              <Response kind="V.">E Vós, Senhor, tende piedade de nós.</Response>
              <Response kind="R.">Demos graças a Deus.</Response>
              <Response kind="V.">Nosso socorro está em o Nome do Senhor.</Response>
              <Response kind="R.">Que fez o céu e a terra.</Response>
              <Response kind="V.">Abençoai-nos.</Response>
              <Response kind="R.">Ó Deus.</Response>
              <p><span className="font-semibold text-ancient-gold">Bênção.</span> O Senhor nos abençoe (faz-se o sinal da Cruz), nos preserve de todo o mal e nos conduza à vida eterna. E as almas dos fiéis defuntos, pela misericórdia de Deus, descansem em paz.</p>
              <Response kind="R.">Amém.</Response>
            </PrayerBlock>

            <PrayerBlock title="Salmo 129 — De profundis" textClassName={textClassName} note="A transcrição fornecida remete à página 190. O texto do salmo exibido aqui é uma versão tradicional em português e ainda precisa ser conferido palavra por palavra com essa página do exemplar.">
              <p>Do profundo abismo clamo a Vós, Senhor; Senhor, ouvi a minha voz. Estejam atentos os vossos ouvidos à voz da minha súplica.</p>
              <p>Se observardes, Senhor, as iniquidades, Senhor, quem subsistirá? Mas em Vós está a propiciação, e por causa da vossa lei esperei em Vós, Senhor.</p>
              <p>Minha alma esperou na sua palavra; minha alma esperou no Senhor. Desde a vigília da manhã até à noite, espere Israel no Senhor.</p>
              <p>Porque no Senhor há misericórdia, e nele há copiosa redenção. E Ele mesmo remirá Israel de todas as suas iniquidades.</p>
              <Response kind="V.">Descanso eterno, dai-lhes, Senhor.</Response>
              <Response kind="R.">E a luz perpétua os ilumine.</Response>
              <p>Descansem em paz.</p>
              <Response kind="R.">Amém.</Response>
              <p><span className="font-semibold text-ancient-gold">Oremos.</span> Ó Deus, que perdoais aos pecadores e desejais a salvação dos homens, nós imploramos a vossa clemência, por intercessão da Bem-aventurada sempre Virgem Maria e de todos os vossos Santos, em favor dos nossos irmãos, parentes e benfeitores que saíram deste mundo, a fim de que alcancem a bem-aventurança eterna. Por Nosso Senhor Jesus Cristo.</p>
              <Response kind="R.">Amém.</Response>
            </PrayerBlock>

            <PrayerBlock title={paschalTime ? "Regina Caeli" : "Angelus"} textClassName={textClassName} note={paschalTime ? "No Tempo Pascal, o Regina Caeli substitui o Angelus." : "A edição do missal registra indulgências ligadas à recitação devota do Angelus."}>
              {paschalTime ? <ReginaCaeliText /> : <AngelusText />}
            </PrayerBlock>
          </>
        ) : (
          <>
            <PrayerBlock title="Preparação para o repouso" textClassName={textClassName}>
              <p>Conceda-nos o Senhor onipotente uma noite tranquila e um termo feliz!</p>
              <Response kind="R.">Amém.</Response>
              <p><span className="font-semibold text-ancient-gold">Leitura de São Pedro.</span> Irmãos: Sede sóbrios e vigiai, porque vosso adversário, o demônio, como um leão a rugir, anda ao redor de vós, buscando a quem devorar. Resisti-lhe, firmes na fé.</p>
              <Response kind="V.">E Vós, Senhor, tende piedade de nós.</Response>
              <Response kind="R.">Demos graças a Deus.</Response>
              <Response kind="V.">Nosso socorro está em o Nome do Senhor.</Response>
              <Response kind="R.">Que fez o céu e a terra.</Response>
            </PrayerBlock>

            <PrayerBlock title="Exame de consciência" textClassName={textClassName}>
              <p>Faça-se uma pequena pausa para examinar a consciência sobre:</p>
              <div>
                <p className="font-semibold text-ancient-gold">1. Deveres para com Deus</p>
                <p>Omissões ou negligências nos atos de piedade; irreverências na Igreja; distrações voluntárias nas orações; resistência à graça; juramentos; murmurações; falta de confiança e resignação.</p>
              </div>
              <div>
                <p className="font-semibold text-ancient-gold">2. Deveres para com o próximo</p>
                <p>Juízos temerários; desprezo; ódio; inveja; desejo de vingança; disputa; injúrias; dano nos bens ou na reputação alheia; mau exemplo; escândalo. Falta de obediência, de respeito e de caridade.</p>
              </div>
              <div>
                <p className="font-semibold text-ancient-gold">3. Deveres para consigo mesmo</p>
                <p>Vaidade; respeito humano; mentiras. Pensamentos, desejos, palavras e ações contrários à pureza. Intemperança; cólera; impaciência; vida inútil e sensual; preguiça de cumprir os deveres do próprio estado.</p>
              </div>
            </PrayerBlock>

            <PrayerBlock title="Confissão e súplicas de perdão" textClassName={textClassName}>
              <p><span className="font-semibold text-ancient-gold">Confissão.</span> Eu, pecador, me confesso a Deus todo-poderoso, à Bem-aventurada sempre Virgem Maria, ao bem-aventurado São Miguel Arcanjo, ao bem-aventurado São João Batista, aos santos Apóstolos Pedro e Paulo e a todos os Santos, que pequei muitas vezes, por pensamentos, palavras e obras, por minha culpa, minha culpa, minha tão grande culpa. Portanto, rogo à Bem-aventurada sempre Virgem Maria, ao bem-aventurado São Miguel Arcanjo, ao bem-aventurado São João Batista, aos santos Apóstolos Pedro e Paulo e a todos os Santos que roguem a Deus Nosso Senhor por mim.</p>
              <p>O Deus onipotente se compadeça de nós e, perdoados os nossos pecados, nos conduza à vida eterna.</p>
              <Response kind="R.">Amém.</Response>
              <p>Indulgência, absolvição e remissão dos nossos pecados conceda-nos o Senhor onipotente e misericordioso.</p>
              <Response kind="R.">Amém.</Response>
              <Response kind="V.">Convertei-nos, ó Deus, que sois a nossa salvação.</Response>
              <Response kind="R.">Afastai a vossa ira de nós.</Response>
              <Response kind="V.">Ó Deus, vinde em meu auxílio.</Response>
              <Response kind="R.">Senhor, apressai-Vos em me socorrer.</Response>
              <p>Glória ao Padre, e ao Filho, e ao Espírito Santo. Assim como era no princípio, agora e sempre, e por todos os séculos dos séculos. Amém.</p>
            </PrayerBlock>

            <PrayerBlock title="Cântico — Nunc dimittis" textClassName={textClassName}>
              <p className="font-semibold text-ancient-gold">Antífona</p>
              <p>Salvai-nos.</p>
              <p>Agora, Senhor, despedi em paz o vosso Servo, segundo a vossa palavra.</p>
              <p>Porque os meus olhos viram a salvação que nos destes,</p>
              <p>que preparastes diante de todos os povos:</p>
              <p>luz para esclarecer as nações e para glória de Israel, vosso povo.</p>
              <p>Glória ao Padre, e ao Filho, e ao Espírito Santo. Assim como era no princípio, agora e sempre, e por todos os séculos dos séculos. Amém.</p>
              <p className="font-semibold text-ancient-gold">Antífona</p>
              <p>Salvai-nos, Senhor, enquanto estamos acordados, e guardai-nos durante o sono, a fim de que vigiemos com o Cristo e descansemos em paz.</p>
            </PrayerBlock>

            <PrayerBlock title="Hino" textClassName={textClassName}>
              <p>Antes que a luz desapareça, nós Vos suplicamos, Criador de todas as coisas, que sejais, por vossa clemência, nosso protetor e nosso guarda.</p>
              <p>Longe de nós os sonhos e os fantasmas da noite! Reprimi o nosso inimigo, a fim de que nada manche os nossos corpos.</p>
              <p>Concedei-nos esta graça, ó Pai misericordioso, e Vós, ó Filho Unigênito, que reinais com o Espírito Consolador, por todos os séculos. Amém.</p>
            </PrayerBlock>

            <PrayerBlock title="Capítulo e responsório" textClassName={textClassName}>
              <p>Vós, Senhor, estais conosco, e foi invocado o vosso santo Nome em nosso favor; não nos abandoneis, ó Senhor, nosso Deus.</p>
              <Response kind="R.">Demos graças a Deus.</Response>
              <Response kind="V.">Guardai-nos, Senhor, como à pupila dos olhos.</Response>
              <Response kind="R.">Protegei-nos à sombra de vossas asas.</Response>
              <Response kind="V.">Senhor, tende piedade de nós.</Response>
              <Response kind="R.">Cristo, tende piedade de nós.</Response>
              <Response kind="R.">Senhor, tende piedade de nós.</Response>
              <p><span className="font-semibold text-ancient-gold">V.</span> Padre nosso (em voz baixa).</p>
              <Response kind="V.">E não nos deixeis cair em tentação.</Response>
              <Response kind="R.">Mas livrai-nos do mal.</Response>
              <Response kind="V.">Senhor, ouvi a minha oração.</Response>
              <Response kind="R.">E chegue a Vós o meu clamor.</Response>
              <p><span className="font-semibold text-ancient-gold">Oremos.</span> Visitai, Senhor, nós Vos suplicamos, esta habitação e afastai para longe dela todas as ciladas do inimigo; nela habitem os vossos santos Anjos para nos conservar em paz, e vossa bênção sempre nos proteja. Por Nosso Senhor Jesus Cristo.</p>
              <Response kind="R.">Amém.</Response>
              <Response kind="V.">Senhor, ouvi a minha oração.</Response>
              <Response kind="R.">E chegue até Vós o meu clamor.</Response>
              <Response kind="V.">Bendigamos ao Senhor.</Response>
              <Response kind="R.">Demos graças a Deus.</Response>
              <p><span className="font-semibold text-ancient-gold">Bênção.</span> O Senhor onipotente e misericordioso, Padre, Filho e Espírito Santo, nos abençoe e nos guarde.</p>
              <Response kind="R.">Amém.</Response>
            </PrayerBlock>

            <PrayerBlock title={paschalTime ? "Regina Caeli" : "Salve Rainha"} textClassName={textClassName} note={paschalTime ? "Durante o Tempo Pascal, o Regina Caeli substitui a Salve Rainha." : undefined}>
              {paschalTime ? (
                <ReginaCaeliText />
              ) : (
                <>
                  <p>Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva; a vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei; e depois deste desterro mostrai-nos Jesus, bendito fruto de vosso ventre, ó clemente, ó piedosa, ó doce Virgem Maria.</p>
                  <Response kind="V.">Rogai por nós, Santa Mãe de Deus.</Response>
                  <Response kind="R.">Para que sejamos dignos das promessas de Cristo.</Response>
                  <p><span className="font-semibold text-ancient-gold">Oração.</span> Infundi, Senhor, em nossas almas a vossa graça, para que nós, que conhecemos pela anunciação do Anjo a Encarnação de Jesus Cristo, vosso Filho, cheguemos por sua Paixão e Cruz à glória da Ressurreição. Pelo mesmo Jesus Cristo, Senhor nosso.</p>
                  <Response kind="R.">Amém.</Response>
                </>
              )}
            </PrayerBlock>
          </>
        )}

        <footer className="text-center pt-5 pb-3 border-t border-ancient-gold/20 text-xs text-parchment/50 font-inter">
          Missal Quotidiano — Dom Beda Keckeisen, O.S.B. · Transcrição fornecida pelo usuário, com correções tipográficas de OCR.
        </footer>
      </div>
    </main>
  );
}
