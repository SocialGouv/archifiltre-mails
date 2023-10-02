/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useService } from "@common/modules/ContainerModule";
import type { PstShallowFolder } from "@common/modules/pst-extractor/type";
import { isPlural } from "@common/utils";
import React, { useMemo, useState } from "react";

import { usePstStore } from "../../store/PSTStore";
import { DashboardInformationsMail } from "../../views/dashboard/DashboardInformationsMail";
import style from "./Hierarchy.module.scss";

interface HierarchyType {
    hierarchyData: PstShallowFolder[];
}

interface HierarchyNodeType {
    node: PstShallowFolder;
}

const mainInfos = {
    color: "rgba(31, 120, 180, 0.65)",
    data: {
        email: {
            attachmentCount: 0,
            attachments: [],
            bcc: [],
            cc: [
                {
                    email: "aude.roelly@culture.gouv.fr",
                    name: "aude.roelly@culture.gouv.fr",
                },
                {
                    email: "charly.jollivet@culture.gouv.fr",
                    name: "charly.jollivet@culture.gouv.fr",
                },
                {
                    email: "melanie.rebours@culture.gouv.fr",
                    name: "melanie.rebours@culture.gouv.fr",
                },
                {
                    email: "amable.sablon-du-corail@culture.gouv.fr",
                    name: "amable.sablon-du-corail@culture.gouv.fr",
                },
                {
                    email: "marie.ranquet@culture.gouv.fr",
                    name: "Marie Ranquet",
                },
                {
                    email: "herve.delmare@culture.gouv.fr",
                    name: "DELMARE Herve",
                },
                {
                    email: "bruno.ricard@culture.gouv.fr",
                    name: "bruno RICARD",
                },
                {
                    email: "francoise.banat-berger@culture.gouv.fr",
                    name: "francoise.banat-berger@culture.gouv.fr",
                },
            ],
            contentHTML: "",
            contentRTF:
                "{\\rtf1\\ansi\\ansicpg1252\\fromhtml1 \\deff0{\\fonttbl\n\r{\\f0\\fswiss\\fcharset0 Arial;}\n\r{\\f1\\fmodern\\fcharset0 Courier New;}\n\r{\\f2\\fnil\\fcharset2 Symbol;}\n\r{\\f3\\fmodern\\fcharset0 Courier New;}\n\r{\\f4\\fswiss\\fcharset0 CMU Sans Serif;}}\n\r{\\colortbl\\red0\\green0\\blue0;\\red0\\green0\\blue255;}\n\r\\uc1\\pard\\plain\\deftab360 \\f0\\fs24 \n\r{\\*\\htmltag19 <html>}\n\r{\\*\\htmltag2 \\par }\n\r{\\*\\htmltag242   }\n\r{\\*\\htmltag34 <head>}\n\r{\\*\\htmltag1 \\par }\n\r{\\*\\htmltag241     }\n\r{\\*\\htmltag1 \\par }\n\r{\\*\\htmltag241   }\n\r{\\*\\htmltag41 </head>}\n\r{\\*\\htmltag2 \\par }\n\r{\\*\\htmltag242   }\n\r{\\*\\htmltag50 <body text=\"#000000\" bgcolor=\"#FFFFFF\">}\\htmlrtf \\viewkind5\n\r{\\*\\background {\\shp{\\*\\shpinst{\\sp{\\sn fillColor}{\\sv 16777215}}{\\sp{\\sn fFilled}{\\sv 1}}}}}\\htmlrtf0 \n\r{\\*\\htmltag0 \\par }\n\r{\\*\\htmltag240     }\n\r{\\*\\htmltag96 <div class=\"moz-cite-prefix\">}\\htmlrtf {\\htmlrtf0 {\\*\\htmltag64}\\htmlrtf {\\htmlrtf0 \n\r{\\*\\htmltag148 <font face=\"CMU Sans Serif\">}\\htmlrtf {\\f4 \\htmlrtf0 Bonjour\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84         }El\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 onore, \n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84         }\n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84         }Merci de ton mail. On a en effet vu le probl\n\r{\\*\\htmltag84 &egrave;}\\htmlrtf \\'e8\\htmlrtf0 me et on va se\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84         }tourner vers le SGG pour voir comment on doit s'adapter.\n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84         }\n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84         }Pour information, en lisant ces textes, j'ai d\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 couvert ce site,\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84         }fort int\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 ressant, je ne sais pas si tu es all\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 e le voir : {}\n\r{\\*\\htmltag84 <a\\par           moz-do-not-send=\"true\" class=\"moz-txt-link-freetext\"\\par           href=\"http://extraqual.pm.ader.gouv.fr/\">}\\htmlrtf {\\field{\\*\\fldinst{HYPERLINK \"http://extraqual.pm.ader.gouv.fr/\"}}{\\fldrslt\\cf1\\ul \\htmlrtf0 http://extraqual.pm.ader.gouv.fr/\\htmlrtf }\\htmlrtf0 \\htmlrtf }\\htmlrtf0 \n\r{\\*\\htmltag92 </a>}.\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84         }Et notamment cette fiche sur les circulaires : {}\n\r{\\*\\htmltag84 <a\\par           moz-do-not-send=\"true\" class=\"moz-txt-link-freetext\"\\par           href=\"http://extraqual.pm.ader.gouv.fr/legistique/137.htm\">}\\htmlrtf {\\field{\\*\\fldinst{HYPERLINK \"http://extraqual.pm.ader.gouv.fr/legistique/137.htm\"}}{\\fldrslt\\cf1\\ul \\htmlrtf0 http://extraqual.pm.ader.gouv.fr/legistique/137.htm\\htmlrtf }\\htmlrtf0 \\htmlrtf }\\htmlrtf0 \n\r{\\*\\htmltag92 </a>}.\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84         }\n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84         }Elle m'a sembl\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0  d\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 faire certaines id\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 es concernant les\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84         }circulaires de tri et de conservation des archives publiques : \"\n\r{\\*\\htmltag84 <i>}\\htmlrtf {\\i \\htmlrtf0 Sous\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84           }des appellations diverses \n\r{\\*\\htmltag84 &#8211;}\\htmlrtf \\'96\\htmlrtf0  circulaires, directives, notes de\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84           }service, instructions, etc. \n\r{\\*\\htmltag84 &#8211;}\\htmlrtf \\'96\\htmlrtf0 , les administrations\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84           }communiquent avec leurs agents et les usagers pour exposer les\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84           }principes d'une politique, fixer les r\n\r{\\*\\htmltag84 &egrave;}\\htmlrtf \\'e8\\htmlrtf0 gles de fonctionnement\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84           }des services et commenter ou orienter l'application des lois\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84           }et r\n\r{\\*\\htmltag84 &egrave;}\\htmlrtf \\'e8\\htmlrtf0 glements.\n\r{\\*\\htmltag92 </i>}\\htmlrtf }\\htmlrtf0 \n\r{\\*\\htmltag84 <i>}\\htmlrtf {\\i \\htmlrtf0 \n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84         }\n\r{\\*\\htmltag92 </i>}\\htmlrtf }\\htmlrtf0 \n\r{\\*\\htmltag84 <i>}\\htmlrtf {\\i \\htmlrtf0 Si le terme \n\r{\\*\\htmltag84 &laquo;}\\htmlrtf \\'ab\\htmlrtf0  circulaire \n\r{\\*\\htmltag84 &raquo;}\\htmlrtf \\'bb\\htmlrtf0  est le plus souvent employ\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 ,\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84           }la d\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 nomination de ces documents qui suivent un r\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 gime\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84           }juridique principalement d\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 termin\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0  par leur contenu n'a par\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84           }elle-m\n\r{\\*\\htmltag84 &ecirc;}\\htmlrtf \\'ea\\htmlrtf0 me aucune incidence juridique : une \n\r{\\*\\htmltag84 &laquo;}\\htmlrtf \\'ab\\htmlrtf0  circulaire \n\r{\\*\\htmltag84 &raquo;}\\htmlrtf \\'bb\\htmlrtf0  n'a\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84           }ni plus ni moins de valeur qu'une \n\r{\\*\\htmltag84 &laquo;}\\htmlrtf \\'ab\\htmlrtf0  note de service \n\r{\\*\\htmltag84 &raquo;}\\htmlrtf \\'bb\\htmlrtf0 .\n\r{\\*\\htmltag92 </i>}\\htmlrtf }\\htmlrtf0 \"\n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84         }Donc : \n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84         }- peu importe le vocabulaire : au regard du droit, circulaires,\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84         }instructions, note d'information, c'est la m\n\r{\\*\\htmltag84 &ecirc;}\\htmlrtf \\'ea\\htmlrtf0 me chose. Il n'est\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84         }donc pas possible de s'en sortir par un simple changement de\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84         }d\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 nomination.\n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84         }- tous ces textes peuvent avoir une valeur contraignante devant\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84         }le juge administratif : \"\n\r{\\*\\htmltag84 <i>}\\htmlrtf {\\i \\htmlrtf0 Une circulaire peut \n\r{\\*\\htmltag84 &ecirc;}\\htmlrtf \\'ea\\htmlrtf0 tre d\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 f\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 r\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 e au\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84           }juge administratif, y compris lorsqu'elle se borne \n\r{\\*\\htmltag84 &agrave;}\\htmlrtf \\'e0\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84           }interpr\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 ter la l\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 gislation ou la r\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 glementation, d\n\r{\\*\\htmltag84 &egrave;}\\htmlrtf \\'e8\\htmlrtf0 s lors que\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84           }les dispositions qu'elle comporte pr\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 sentent un caract\n\r{\\*\\htmltag84 &egrave;}\\htmlrtf \\'e8\\htmlrtf0 re\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84           }imp\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 ratif (CE, Sect., 18 d\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 cembre 2002, Mme Duvign\n\r{\\*\\htmltag84 &egrave;}\\htmlrtf \\'e8\\htmlrtf0 res, n\n\r{\\*\\htmltag84 &deg;}\\htmlrtf \\'b0\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84           }233618)\n\r{\\*\\htmltag92 </i>}\\htmlrtf }\\htmlrtf0 \".\n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84         }\n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84         }Il faut voir du coup comment on peut s'en sortir : on peut\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84         }envisager de faire des circulaires se limitant \n\r{\\*\\htmltag84 &agrave;}\\htmlrtf \\'e0\\htmlrtf0  annoncer la\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84         }publication des tableaux de tri ou de guides de recommandation\n\r{\\*\\htmltag4 \\par }\\htmlrtf  \\htmlrtf0 \n\r{\\*\\htmltag84         }qui seraient renvoy\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 s en annexe. A voir si \n\r{\\*\\htmltag84 &ccedil;}\\htmlrtf \\'e7\\htmlrtf0 a passe.\n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84         }\n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84         }On te tient au courant.\n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84         }\n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84         }Bien \n\r{\\*\\htmltag84 &agrave;}\\htmlrtf \\'e0\\htmlrtf0  toi, \n\r{\\*\\htmltag156 </font>}\\htmlrtf }\\htmlrtf0 \n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84       }{\\*\\htmltag72}\\htmlrtf\\par}\\htmlrtf0\n\r\n\r{\\*\\htmltag128 <pre class=\"moz-signature\" cols=\"72\">}\\htmlrtf {\\pard\\plain\\f1\\fs20 \\htmlrtf0 \\htmlrtf {\\htmlrtf0 Antoine Meissonnier.\\line\n\rConservateur du patrimoine,\\line\n\radjoint au chef du bureau de la gestion, de la s\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 lection et de la collecte,\\line\n\rService interminist\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 riel des Archives de France,\\line\n\r\\line\n\r56 rue des Francs-Bourgeois\\line\n\r75141 Paris Cedex 03\\line\n\rTel : 01.40.27.66.48\\line\n\r{}\n\r{\\*\\htmltag84 <a class=\"moz-txt-link-abbreviated\" href=\"mailto:antoine.meissonnier@culture.gouv.fr\">}\\htmlrtf {\\field{\\*\\fldinst{HYPERLINK \"mailto:antoine.meissonnier@culture.gouv.fr\"}}{\\fldrslt\\cf1\\ul \\htmlrtf0 antoine.meissonnier@culture.gouv.fr\\htmlrtf }\\htmlrtf0 \\htmlrtf }\\htmlrtf0 \n\r{\\*\\htmltag92 </a>}\\htmlrtf\\par}\\htmlrtf0\n\r\n\r{\\*\\htmltag136 </pre>}\\htmlrtf }\\htmlrtf0 \n\r{\\*\\htmltag0 \\par }\n\r{\\*\\htmltag240       }{\\*\\htmltag64}\\htmlrtf {\\htmlrtf0 Le 22/07/2013 10:22, {}\n\r{\\*\\htmltag84 <a class=\"moz-txt-link-abbreviated\" href=\"mailto:Eleonore.ALQUIER@sante.gouv.fr\">}\\htmlrtf {\\field{\\*\\fldinst{HYPERLINK \"mailto:Eleonore.ALQUIER@sante.gouv.fr\"}}{\\fldrslt\\cf1\\ul \\htmlrtf0 Eleonore.ALQUIER@sante.gouv.fr\\htmlrtf }\\htmlrtf0 \\htmlrtf }\\htmlrtf0 \n\r{\\*\\htmltag92 </a>} a \n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 crit\n\r{\\*\\htmltag84 &nbsp;}\\htmlrtf \\'a0\\htmlrtf0 :\n\r{\\*\\htmltag116 <br>}\\htmlrtf \\line\n\r\\htmlrtf0 \n\r{\\*\\htmltag4 \\par }\n\r{\\*\\htmltag84     }{\\*\\htmltag72}\\htmlrtf\\par}\\htmlrtf0\n\r\n\r{\\*\\htmltag104 </div>}\\htmlrtf }\\htmlrtf0 \n\r{\\*\\htmltag0 \\par }\n\r{\\*\\htmltag240     }\n\r{\\*\\htmltag96 <blockquote\\par cite=\"mid:800E08D4EA3719428B7F45470077EB250154AC9C@AC002703.ac.intranet.sante.gouv.fr\"\\par       type=\"cite\">}\\htmlrtf \\par\n\r{\\htmlrtf0 \n\r{\\*\\htmltag0 \\par }\n\r{\\*\\htmltag240       }\n\r{\\*\\htmltag128 <pre wrap=\"\">}\\htmlrtf {\\pard\\plain\\f1\\fs20 \\htmlrtf0 \\htmlrtf {\\htmlrtf0 \\li360  \n\r{\\*\\htmltag84 &lt;}\\htmlrtf <\\htmlrtf0 \n\r{\\*\\htmltag84 &lt;}\\htmlrtf <\\htmlrtf0 releve-de-decisions-cimap3-17-juillet-2013.pdf\n\r{\\*\\htmltag84 &gt;}\\htmlrtf >\\htmlrtf0 \n\r{\\*\\htmltag84 &gt;}\\htmlrtf >\\htmlrtf0   \\line\n\rBonjour \n\r{\\*\\htmltag84 &agrave;}\\htmlrtf \\'e0\\htmlrtf0  tous,\\line\n\r\\line\n\rLe dernier CIMAP \n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 voque dans son relev\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0  de d\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 cisions le traitement et l'usage des circulaires minist\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 rielles. La d\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 cision n\n\r{\\*\\htmltag84 &deg;}\\htmlrtf \\'b0\\htmlrtf0 25 en particulier indique que :\\line\n\r\"L'usage des circulaires sera r\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 serv\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0  \n\r{\\*\\htmltag84 &agrave;}\\htmlrtf \\'e0\\htmlrtf0  la diffusion d'instructions sign\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 es personnellement par les ministres, se pr\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 sentant sous l'intitul\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0  \n\r{\\*\\htmltag84 &laquo;}\\htmlrtf \\'ab\\htmlrtf0  Instructions du Gouvernement \n\r{\\*\\htmltag84 &raquo;}\\htmlrtf \\'bb\\htmlrtf0 , et limit\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 e \n\r{\\*\\htmltag84 &agrave;}\\htmlrtf \\'e0\\htmlrtf0  5 pages maximum. L'information des services sera assur\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 e par les outils intranet des minist\n\r{\\*\\htmltag84 &egrave;}\\htmlrtf \\'e8\\htmlrtf0 res en privil\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 giant l'interactivit\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0  (\n\r{\\*\\htmltag84 &laquo;}\\htmlrtf \\'ab\\htmlrtf0  questions-r\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 ponses \n\r{\\*\\htmltag84 &raquo;}\\htmlrtf \\'bb\\htmlrtf0 , guides et modes d'emploi, forums d'\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 changes notamment). Les sites Internet des minist\n\r{\\*\\htmltag84 &egrave;}\\htmlrtf \\'e8\\htmlrtf0 res permettront de proposer au public un service d'informations actualis\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 es et index\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 es pour les moteurs de recherche.\"\\line\n\r\\line\n\rLe fait notamment de limiter le nombre de pages \n\r{\\*\\htmltag84 &agrave;}\\htmlrtf \\'e0\\htmlrtf0  5 devrait-il entra\n\r{\\*\\htmltag84 &icirc;}\\htmlrtf \\'ee\\htmlrtf0 ner une nouvelle forme de validation, ou du moins d'intitul\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 , des tableaux de gestion ?\\line\n\r\\line\n\rMerci de votre attention, et tr\n\r{\\*\\htmltag84 &egrave;}\\htmlrtf \\'e8\\htmlrtf0 s bon d\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 but de semaine,\\line\n\rEleonore\\line\n\r\\line\n\r\\line\n\rLe message est pr\n\r{\\*\\htmltag84 &ecirc;}\\htmlrtf \\'ea\\htmlrtf0 t \n\r{\\*\\htmltag84 &agrave;}\\htmlrtf \\'e0\\htmlrtf0  \n\r{\\*\\htmltag84 &ecirc;}\\htmlrtf \\'ea\\htmlrtf0 tre envoy\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0  avec le fichier suivant ou les liens joints :\\line\n\r\\line\n\rreleve-de-decisions-cimap3-17-juillet-2013.pdf\\line\n\r\\line\n\r\\line\n\rRemarque\n\r{\\*\\htmltag84 &nbsp;}\\htmlrtf \\'a0\\htmlrtf0 :\n\r{\\*\\htmltag84 &nbsp;}\\htmlrtf \\'a0\\htmlrtf0 pour se prot\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 ger de virus informatiques, il se peut que les programmes de messagerie \n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 lectronique \n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 vitent d'envoyer ou de recevoir certains types de pi\n\r{\\*\\htmltag84 &egrave;}\\htmlrtf \\'e8\\htmlrtf0 ces jointes. V\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 rifiez les param\n\r{\\*\\htmltag84 &egrave;}\\htmlrtf \\'e8\\htmlrtf0 tres de s\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 curit\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0  de votre messagerie \n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 lectronique pour d\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 terminer de quelle mani\n\r{\\*\\htmltag84 &egrave;}\\htmlrtf \\'e8\\htmlrtf0 re les pi\n\r{\\*\\htmltag84 &egrave;}\\htmlrtf \\'e8\\htmlrtf0 ces jointes sont g\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 r\n\r{\\*\\htmltag84 &eacute;}\\htmlrtf \\'e9\\htmlrtf0 es.\\par\\htmlrtf}\\htmlrtf0\n\r\n\r{\\*\\htmltag136 </pre>}\\htmlrtf }\\htmlrtf0 \n\r{\\*\\htmltag0 \\par }\n\r{\\*\\htmltag240     }\n\r{\\*\\htmltag104 </blockquote>}\\htmlrtf }\\par\n\r\\htmlrtf0 \n\r{\\*\\htmltag0 \\par }\n\r{\\*\\htmltag240     }\n\r{\\*\\htmltag112 <br>}\\htmlrtf \\par\n\r\\htmlrtf0 \n\r{\\*\\htmltag0 \\par }\n\r{\\*\\htmltag240   }\n\r{\\*\\htmltag58 </body>}\n\r{\\*\\htmltag2 \\par }\n\r{\\*\\htmltag27 </html>}\n\r{\\*\\htmltag3 \\par }}",
            contentText:
                "Bonjour Eléonore, \r\n\r\nMerci de ton mail. On a en effet vu le problème et on va se tourner vers le SGG pour voir comment on doit s'adapter.\r\n\r\nPour information, en lisant ces textes, j'ai découvert ce site, fort intéressant, je ne sais pas si tu es allée le voir : http://extraqual.pm.ader.gouv.fr/. Et notamment cette fiche sur les circulaires : http://extraqual.pm.ader.gouv.fr/legistique/137.htm. \r\nElle m'a semblé défaire certaines idées concernant les circulaires de tri et de conservation des archives publiques : \"Sous des appellations diverses – circulaires, directives, notes de service, instructions, etc. –, les administrations communiquent avec leurs agents et les usagers pour exposer les principes d'une politique, fixer les règles de fonctionnement des services et commenter ou orienter l'application des lois et règlements.\r\nSi le terme « circulaire » est le plus souvent employé, la dénomination de ces documents qui suivent un régime juridique principalement déterminé par leur contenu n'a par elle-même aucune incidence juridique : une « circulaire » n'a ni plus ni moins de valeur qu'une « note de service ».\"\r\nDonc : \r\n- peu importe le vocabulaire : au regard du droit, circulaires, instructions, note d'information, c'est la même chose. Il n'est donc pas possible de s'en sortir par un simple changement de dénomination.\r\n- tous ces textes peuvent avoir une valeur contraignante devant le juge administratif : \"Une circulaire peut être déférée au juge administratif, y compris lorsqu'elle se borne à interpréter la législation ou la réglementation, dès lors que les dispositions qu'elle comporte présentent un caractère impératif (CE, Sect., 18 décembre 2002, Mme Duvignères, n° 233618)\".\r\n\r\nIl faut voir du coup comment on peut s'en sortir : on peut envisager de faire des circulaires se limitant à annoncer la publication des tableaux de tri ou de guides de recommandation qui seraient renvoyés en annexe. A voir si ça passe.\r\n\r\nOn te tient au courant.\r\n\r\nBien à toi, \r\n\r\nAntoine Meissonnier.\r\n\r\nConservateur du patrimoine,\r\n\r\nadjoint au chef du bureau de la gestion, de la sélection et de la collecte,\r\n\r\nService interministériel des Archives de France,\r\n\r\n\r\n\r\n56 rue des Francs-Bourgeois\r\n\r\n75141 Paris Cedex 03\r\n\r\nTel : 01.40.27.66.48\r\n\r\nantoine.meissonnier@culture.gouv.fr <mailto:antoine.meissonnier@culture.gouv.fr> \r\nLe 22/07/2013 10:22, Eleonore.ALQUIER@sante.gouv.fr <mailto:Eleonore.ALQUIER@sante.gouv.fr>  a écrit :\r\n\r\n\r\n <<releve-de-decisions-cimap3-17-juillet-2013.pdf>>  \r\n\r\nBonjour à tous,\r\n\r\n\r\n\r\nLe dernier CIMAP évoque dans son relevé de décisions le traitement et l'usage des circulaires ministérielles. La décision n°25 en particulier indique que :\r\n\r\n\"L'usage des circulaires sera réservé à la diffusion d'instructions signées personnellement par les ministres, se présentant sous l'intitulé « Instructions du Gouvernement », et limitée à 5 pages maximum. L'information des services sera assurée par les outils intranet des ministères en privilégiant l'interactivité (« questions-réponses », guides et modes d'emploi, forums d'échanges notamment). Les sites Internet des ministères permettront de proposer au public un service d'informations actualisées et indexées pour les moteurs de recherche.\"\r\n\r\n\r\n\r\nLe fait notamment de limiter le nombre de pages à 5 devrait-il entraîner une nouvelle forme de validation, ou du moins d'intitulé, des tableaux de gestion ?\r\n\r\n\r\n\r\nMerci de votre attention, et très bon début de semaine,\r\n\r\nEleonore\r\n\r\n\r\n\r\n\r\n\r\nLe message est prêt à être envoyé avec le fichier suivant ou les liens joints :\r\n\r\n\r\n\r\nreleve-de-decisions-cimap3-17-juillet-2013.pdf\r\n\r\n\r\n\r\n\r\n\r\nRemarque : pour se protéger de virus informatiques, il se peut que les programmes de messagerie électronique évitent d'envoyer ou de recevoir certains types de pièces jointes. Vérifiez les paramètres de sécurité de votre messagerie électronique pour déterminer de quelle manière les pièces jointes sont gérées.\r\n\r\n\r\n",
            elementPath: "",
            from: {
                email: "antoine.meissonnier@culture.gouv.fr",
                name: "Antoine Meissonnier",
            },
            id: "mail-893",
            isFromMe: false,
            messageId: "<51ED0446.5050909@culture.gouv.fr>",
            receivedTime: 1374487629000,
            sentTime: 1374487622000,
            subject: "Re: CIMAP : décision relative aux circulaires",
            to: [
                {
                    email: "/o=mass/ou=premier groupe administratif/cn=recipients/cn=ealquier",
                    name: "ALQUIER, Eléonore",
                },
            ],
            transportMessageHeaders:
                'Microsoft Mail Internet Headers Version 2.0\r\nReceived: from AC005703.ac.intranet.sante.gouv.fr ([192.168.98.231]) by AC002703.ac.intranet.sante.gouv.fr with Microsoft SMTPSVC(6.0.3790.4675);\r\n\t Mon, 22 Jul 2013 12:07:09 +0200\r\nReceived: from ac000615.ac.intranet.sante.gouv.fr ([164.131.87.33]) by AC005703.ac.intranet.sante.gouv.fr with Microsoft SMTPSVC(6.0.3790.4675);\r\n\t Mon, 22 Jul 2013 12:07:10 +0200\r\nReceived: from ac000613.ac.intranet.sante.gouv.fr ([164.131.87.31]) by ac000615.ac.intranet.sante.gouv.fr with Microsoft SMTPSVC(6.0.3790.4675); Mon, 22 Jul 2013 12:07:09 +0200\r\nX-PMWin-Version: 3.1.0.0, Antispam-Engine: 2.7.2, Antispam-Data: 2013.7.22.95743, Antivirus-Engine: 3.45.0, Antivirus-Data: 4.91G\r\nX-PMWin-SpamScore: 14\r\nX-PMWin-Spam: Gauge=XIIII, Probability=14, Report=\'__MOZILLA_MSGID 0, __HAS_MSGID 0, __SANE_MSGID 0, __NOTIFICATION_TO 0, __HAS_FROM 0, __USER_AGENT 0, __MOZILLA_USER_AGENT 0, __MIME_VERSION 0, __TO_MALFORMED_2 0, __TO_NO_NAME 0, __MULTIPLE_RCPTS_CC_X2 0, __SUBJ_HIGHBIT 0, __BOUNCE_CHALLENGE_SUBJ 0, __BOUNCE_NDR_SUBJ_EXEMPT 0, __IN_REP_TO 0, __CT 0, __CTYPE_HTML 0, __CTYPE_IS_HTML 0, __CTE 0, __HAS_XOAT 0, __ANY_URI 0, URI_ENDS_IN_HTML 0, __URI_NO_WWW 0, __FRAUD_CONTACT_NUM 0, __CP_URI_IN_BODY 0, __SUBJ_ALPHA_NEGATE 0, __HAS_HTML 0, BODY_SIZE_5000_5999 0, BODYTEXTH_SIZE_10000_LESS 0, __MIME_HTML 0, __MIME_HTML_ONLY 0, __TAG_EXISTS_HTML 0, CTYPE_JUST_HTML 0.848, MULTIPLE_RCPTS 0.1, BODY_SIZE_7000_LESS 0, RETURN_RECEIPT 0.5\'\r\nX-MimeOLE: Produced By Microsoft MimeOLE V6.00.3790.4913\r\nReceived: from ac000949.sante.ader.gouv.fr ([161.48.20.6]) by ac000613.ac.intranet.sante.gouv.fr with Microsoft SMTPSVC(6.0.3790.4675); Mon, 22 Jul 2013 12:07:09 +0200\r\nReceived: from pasteur01.culture.fr (smtp3.culture.ader.gouv.fr [161.48.22.155]) by ac000949.sante.ader.gouv.fr (Postfix) with ESMTP id 5191B1006D for <Eleonore.ALQUIER@sante.gouv.fr>; Mon, 22 Jul 2013 12:07:09 +0200 (CEST)\r\nReceived: from pps.filterd (pasteur01 [127.0.0.1]) by pasteur01.culture.fr (8.14.5/8.14.5) with SMTP id r6MA5n64015530 for <Eleonore.ALQUIER@sante.gouv.fr>; Mon, 22 Jul 2013 12:07:09 +0200\r\nReceived: from pps.reinject (localhost [127.0.0.1]) by pasteur01.culture.fr with ESMTP id 1cykgmwmdq-1 for <Eleonore.ALQUIER@sante.gouv.fr>; Mon, 22 Jul 2013 12:07:09 +0200\r\nReceived: from pasteur01 (pasteur01 [127.0.0.1]) by pps.reinject (8.14.5/8.14.5) with SMTP id r6MA792x018488 for <Eleonore.ALQUIER@sante.gouv.fr>; Mon, 22 Jul 2013 12:07:09 +0200\r\nReceived: from bonnie.culture.fr (bonnie.culture.fr [143.126.201.99]) by pasteur01.culture.fr with ESMTP id 1cykgmwmdp-1; Mon, 22 Jul 2013 12:07:09 +0200\r\nReceived: from [143.126.55.1] (jeckel.culture.fr [143.126.201.39]) by bonnie.culture.fr (Postfix) with ESMTP id E648992002; Mon, 22 Jul 2013 12:06:29 +0200 (CEST)\r\nMessage-ID: <51ED0446.5050909@culture.gouv.fr>\r\nDisposition-Notification-To: "Antoine Meissonnier" <antoine.meissonnier@culture.gouv.fr>\r\nDate: Mon, 22 Jul 2013 12:07:02 +0200\r\nFrom: "Antoine Meissonnier" <antoine.meissonnier@culture.gouv.fr>\r\nUser-Agent: Mozilla/5.0 (Windows NT 5.1; rv:17.0) Gecko/20130620 Thunderbird/17.0.7\r\nMIME-Version: 1.0\r\nTo: <Eleonore.ALQUIER@sante.gouv.fr>\r\nCc: <aude.roelly@culture.gouv.fr>,\r\n\t<charly.jollivet@culture.gouv.fr>,\r\n\t<melanie.rebours@culture.gouv.fr>,\r\n\t<amable.sablon-du-corail@culture.gouv.fr>,\r\n\t"Marie Ranquet" <marie.ranquet@culture.gouv.fr>,\r\n\t"DELMARE Herve" <herve.delmare@culture.gouv.fr>,\r\n\t"bruno RICARD" <bruno.ricard@culture.gouv.fr>,\r\n\t<francoise.banat-berger@culture.gouv.fr>\r\nSubject: =?iso-8859-1?Q?Re:_CIMAP_:_d=E9cision_relative_aux_circulaires?=\r\nReferences: <800E08D4EA3719428B7F45470077EB250154AC9C@AC002703.ac.intranet.sante.gouv.fr>\r\nIn-Reply-To: <800E08D4EA3719428B7F45470077EB250154AC9C@AC002703.ac.intranet.sante.gouv.fr>\r\nContent-Type: text/html;\r\n\tcharset="ISO-8859-1"\r\nContent-Transfer-Encoding: 7bit\r\nX-Virus-Version: vendor=nai engine=5400 definitions=7143 signatures=668565\r\nReturn-Path: <antoine.meissonnier@culture.gouv.fr>\r\nX-OriginalArrivalTime: 22 Jul 2013 10:07:09.0570 (UTC) FILETIME=[3A54BE20:01CE86C3]\r\n\r\n',
            type: "email",
        },
        id: "mail-893",
        ids: ["mail-893"],
        name: "Antoine Meissonnier ",
        size: 1,
        value: "Antoine Meissonnier ",
    },
    depth: 1,
    formattedValue: "50.00%",
    height: 0,
    id: "mail-893",
    path: ["mail-893", "1c645fc6-c6d4-42e9-9879-28c616d027e6"],
    percentage: 49.997500124993756,
    radius: 125.52922688094621,
    value: 1,
    x: 488.26755479364874,
    y: 254.0234375,
};

const HierarchyMailsList = ({ node }) => {
    const pstExtractorService = useService("pstExtractorService");
    const { extractDatas } = usePstStore();

    // useEffect(() => {
    //     // console.log({ extractDatas, node });
    //     const m = extractDatas?.indexes.get(node.mails[0]);

    //     const fetchMails = async () => {
    //         console.log(m);

    //         const mails = await pstExtractorService?.getEmails(m);
    //         console.log(mails);
    //     };

    //     fetchMails();
    // }, []);

    return (
        <div className={style.hierarchy__mailList}>
            <div className={style.hierarchy__mailList__item}>
                01/02/03: Bonjour, ceci est un test. Ne prenez pas en
                considération ce...
            </div>
            <div className={style.hierarchy__mailList__item}>
                01/02/03: Bonjour, ceci est un test. Ne prenez pas en
                considération ce...
            </div>
            <div className={style.hierarchy__mailList__item}>
                01/02/03: Bonjour, ceci est un test. Ne prenez pas en
                considération ce...
            </div>
            <div className={style.hierarchy__mailList__item}>
                01/02/03: Bonjour, ceci est un test. Ne prenez pas en
                considération ce...
            </div>
            <div className={style.hierarchy__mailList__item}>
                01/02/03: Bonjour, ceci est un test. Ne prenez pas en
                considération ce...
            </div>
            <div className={style.hierarchy__mailList__item}>
                01/02/03: Bonjour, ceci est un test. Ne prenez pas en
                considération ce...
            </div>
            <div className={style.hierarchy__mailList__item}>
                01/02/03: Bonjour, ceci est un test. Ne prenez pas en
                considération ce...
            </div>
            <div className={style.hierarchy__mailList__item}>
                01/02/03: Bonjour, ceci est un test. Ne prenez pas en
                considération ce...
            </div>
            <div className={style.hierarchy__mailList__item}>
                01/02/03: Bonjour, ceci est un test. Ne prenez pas en
                considération ce...
            </div>
            <div className={style.hierarchy__mailList__item}>
                01/02/03: Bonjour, ceci est un test. Ne prenez pas en
                considération ce...
            </div>
            <div className={style.hierarchy__mailList__item}>
                01/02/03: Bonjour, ceci est un test. Ne prenez pas en
                considération ce...
            </div>
            <div className={style.hierarchy__mailList__item}>
                01/02/03: Bonjour, ceci est un test. Ne prenez pas en
                considération ce...
            </div>
            <div className={style.hierarchy__mailList__item}>
                01/02/03: Bonjour, ceci est un test. Ne prenez pas en
                considération ce...
            </div>

            <div className={style.hierarchy__mailList__mail}>
                <DashboardInformationsMail mainInfos={mainInfos} />
            </div>
        </div>
    );
};

const HierarchyNode: React.FC<HierarchyNodeType> = ({ node }) => {
    const { subfolders, name, hasSubfolders } = node;

    const [showChildren, setShowChildren] = useState(false);
    // const { extractDatas } = usePstStore();

    const handleClick = () => {
        setShowChildren(!showChildren);
    };

    return (
        <>
            <div
                className={
                    showChildren
                        ? `${style.hierarchy__node} ${style.hierarchy__node__active}`
                        : style.hierarchy__node
                }
                onClick={handleClick}
                data-haschild={subfolders.length}
            >
                <span>
                    {name}
                    <small className={style.hierarchy__folderCount}>
                        (
                        {hasSubfolders
                            ? `${subfolders.length} ${isPlural(
                                  subfolders.length,
                                  "dossier"
                              )}`
                            : `${node.mails.length} ${isPlural(
                                  node.mails.length,
                                  "mail"
                              )}`}
                        )
                    </small>
                </span>
            </div>
            <ul
                className={style.hierarchy__childrenList}
                data-expand={showChildren}
            >
                {showChildren && hasSubfolders ? (
                    <Hierarchy hierarchyData={subfolders} />
                ) : (
                    showChildren && <HierarchyMailsList node={node} />
                )}
            </ul>
        </>
    );
};

export const Hierarchy: React.FC<HierarchyType> = ({ hierarchyData }) => {
    return (
        <div className={style.hierarchy}>
            {hierarchyData.map((node, idx) => (
                <HierarchyNode node={node} key={idx} />
            ))}
        </div>
    );
};

export const HierarchyContainer: React.FC = () => {
    const { extractDatas } = usePstStore();
    const hierarchyData = useMemo(() => {
        return extractDatas?.additionalDatas.folderStructure.subfolders;
    }, [extractDatas]);

    if (!hierarchyData) return null;

    return (
        <div className={style.hierarchyContainer}>
            <Hierarchy hierarchyData={hierarchyData} />
        </div>
    );
};
