import React, { useState, useMemo, useContext, createContext } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, Cell, RadialBarChart, RadialBar, ComposedChart,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine, PolarAngleAxis
} from "recharts";
import {
  LayoutDashboard, GitCompare, Gauge, Table as TableIcon, Search, Radio,
  Target, Users, MapPinned, ArrowUpDown, CheckCircle2,
  AlertTriangle, XCircle, ChevronRight, Activity, Sun, Moon, X, Filter,
  TrendingUp, TrendingDown, Award, ThumbsDown, CandlestickChart as CandlestickChartIcon,
  UserCheck, Phone, Mail, ChevronDown, Building2, UserCircle2, Hash, Layers
} from "lucide-react";

/* ----------------------------- DATOS BASE ----------------------------- */
const CONSULTAS = [
  { key: "abr24", label: "ABR'24" },
  { key: "nov24", label: "NOV'24" },
  { key: "jdp",   label: "JUECES PAZ" },
  { key: "feb25", label: "FEB'25" },
  { key: "abr25", label: "ABR'25" },
  { key: "jul25", label: "JUL'25" },
  { key: "nov25", label: "NOV'25" },
  { key: "mar26", label: "MAR'26" },
];

const RAW_UNITS = [
  { nombre: "MIL GRULLAS", tipo: "COMUNA", votos: [509,445,201,394,421,434,229,310], meta: 1470 },
  { nombre: "LOS OJOS DE CHAVEZ", tipo: "COMUNA", votos: [276,336,199,616,612,486,405,445], meta: 1890 },
  { nombre: "HASTA LA VICTORIA SIEMPRE I", tipo: "COMUNA", votos: [248,199,134,170,304,156,270,204], meta: 990 },
  { nombre: "VOCES LIBERTARIAS", tipo: "CIRCUITO ELECTORAL", votos: [420,378,363,512,314,350,379,382], meta: 480 },
  { nombre: "JUANA RAMIREZ LA AVANZADORA I", tipo: "CIRCUITO ELECTORAL", votos: [1410,358,420,664,1205,707,663,483], meta: 1650 },
  { nombre: "JUNTO VENCEREMOS (LA TRINIDAD)", tipo: "CIRCUITO ELECTORAL", votos: [411,303,329,374,496,1199,361,347], meta: 400 },
  { nombre: "CIRCUITO BELLO MONTE LAS MERCEDES PRADOS", tipo: "CIRCUITO ELECTORAL", votos: [1262,495,754,602,571,975,714,764], meta: 1410 },
  { nombre: "COMUNA 13 DE ABRIL", tipo: "CIRCUITO ELECTORAL", votos: [496,483,370,645,588,723,545,607], meta: 1200 },
  { nombre: "LIVIA GOUVERNEU", tipo: "COMUNA", votos: [911,401,329,465,601,1075,547,544], meta: 2730 },
  { nombre: "LAS LOMAS SOCIALISTA", tipo: "COMUNA", votos: [506,291,230,331,455,693,308,378], meta: 1080 },
  { nombre: "A VIVIR LA LIMONERA", tipo: "COMUNA", votos: [843,644,1002,745,930,1018,867,780], meta: 1020 },
  { nombre: "CON DIOS TODO ES POSIBLE", tipo: "COMUNA", votos: [975,388,678,561,540,547,745,659], meta: 2220 },
  { nombre: "INDIO DE BARUTA", tipo: "COMUNA", votos: [490,266,195,325,272,530,405,491], meta: 1590 },
  { nombre: "SOCIALISTA SANTA CRUZ", tipo: "COMUNA", votos: [504,348,376,338,517,518,441,418], meta: 1600 },
  { nombre: "HASTA LA VICTORIA POR SIEMPRE", tipo: "COMUNA", votos: [454,275,156,259,364,521,314,252], meta: 1470 },
  { nombre: "LOS PLACERES DE MARIA", tipo: "COMUNA", votos: [288,117,167,176,280,567,278,413], meta: 1140 },
  { nombre: "CAFETAL", tipo: "CIRCUITO ELECTORAL", votos: [720,568,819,603,578,2037,479,505], meta: 1530 },
  { nombre: "JUSTICIA E IGUALDAD", tipo: "COMUNA", votos: [1232,533,685,810,658,2031,964,996], meta: 4230 },
  { nombre: "HUGO CHAVEZ FRIAS", tipo: "COMUNA", votos: [1539,580,466,639,777,1161,744,753], meta: 1560 },
  { nombre: "FUERZA Y LUCHA POPULAR DEL ROSARIO", tipo: "COMUNA", votos: [889,385,0,636,787,1060,736,544], meta: 1740 },
  { nombre: "PRIMERA FORTALEZA DEL ROSARIO", tipo: "COMUNA", votos: [538,400,163,210,642,627,479,449], meta: 1200 },
];

const RAW_MESAS = [
  { centro:"UNIDAD EDUCATIVA COLEGIO FRAY LUIS AMIGO", direccion:"URBANIZACIÓN COLINAS DE BELLO MONTE DERECHA AVENIDA CAURIMARE. IZQUIERDA AVENIDA CAURIMARE. FRENTE AVENIDA CAURIMARE AL LADO DE LA CONCHA ACUSTICA JOSE ANGEL LAMAS QUINTA", codComuna:"COM_131601001", codCircuito:"CEC-MI-043", circuito:"CIRCUITO BELLO MONTE LAS MERCEDES PRADOS", mesa:1, cedPres:"26113274", nomPres:"EVELIN FERREIRA", telPres:"4241323501", correoPres:"evelinferreira2128@gmail.com", cedSec:"6398828", nomSec:"JOSE NOGUERA", telSec:"4241179910", correoSec:"noguerajose724@gmail.com" },
  { centro:"UNIDAD EDUCATIVA PRIVADA MINERVA I", direccion:"URBANIZACIÓN PRADOS DEL ESTE IZQUIERDA AVENIDA RIO DE ORO. DERECHA CALLE COLON. FRENTE CALLE SAN ANDRES 50 METROS DE LA PANADERIA RIO DE ORO CASA", codComuna:"COM_131601001", codCircuito:"CEC-MI-043", circuito:"CIRCUITO BELLO MONTE LAS MERCEDES PRADOS", mesa:2, cedPres:"11308569", nomPres:"JOSE MANUEL HUERTA", telPres:"4268064855", correoPres:"chemahme@gmail.com", cedSec:"6544150", nomSec:"EXIMA ESTRELLA", telSec:"4166140882", correoSec:"eximanar@gmail.com" },
  { centro:"INSTITUTO UNIVERSITARIO DE NUEVAS PROFESIONES", direccion:"URBANIZACIÓN LAS MERCEDES FRENTE AVENIDA PRINCIPAL DE LAS MERCEDES. DERECHA CALLE NUEVA YORK. IZQUIERDA CALLE ORINOCO DIAGONAL AL CENTRO COMERCIAL EL TOLON EDIFICIO", codComuna:"COM_131601001", codCircuito:"CEC-MI-043", circuito:"CIRCUITO BELLO MONTE LAS MERCEDES PRADOS", mesa:3, cedPres:"10501537", nomPres:"ANGEL MENDEZ", telPres:"4143167404", correoPres:"Mpbarutasalasituacional@gmail.com", cedSec:"7404021", nomSec:"HILDA OSORIO", telSec:"4123354954", correoSec:"Mpbarutasalasituacional@gmail.com" },
  { centro:"INSTITUTO UNIVERSITARIO DE NUEVAS PROFESIONES", direccion:"URBANIZACIÓN LAS MERCEDES FRENTE AVENIDA PRINCIPAL DE LAS MERCEDES. DERECHA CALLE NUEVA YORK. IZQUIERDA CALLE ORINOCO DIAGONAL AL CENTRO COMERCIAL EL TOLON EDIFICIO", codComuna:"COM_131601001", codCircuito:"CEC-MI-043", circuito:"CIRCUITO BELLO MONTE LAS MERCEDES PRADOS", mesa:4, cedPres:"16116595", nomPres:"LUZ DARY GOMEZ", telPres:"4142378502", correoPres:"Mpbarutasalasituacional@gmail.com", cedSec:"3715150", nomSec:"CARLOS CONTRERAS", telSec:"4149177049", correoSec:"ccontrerasm3@gmail.com" },
  { centro:"LICEO NACIONAL JOSE ALBERTO VELANDIA", direccion:"URBANIZACIÓN LA TRINIDAD IZQUIERDA AVENIDA LA TAHONA. DERECHA CALLE EL MARTILLO. FRENTE CALLE REYNA BENZECI CALLE LA GUAIRITA SECTOR LA TAHONA LA TRINIDAD CASA", codComuna:"COM_131601002", codCircuito:"CEC-MI-042", circuito:"JUNTO VENCEREMOS ( LA TRINIDAD)", mesa:1, cedPres:"6049861", nomPres:"JOSE MARIA GUTIERREZ", telPres:"4141199109", correoPres:"jmgutierrez1704@gmail.com", cedSec:"4586203", nomSec:"LISBE CHANTAL ASTORIN", telSec:"4127006245", correoSec:"lisbethastonin@gmail.com" },
  { centro:"CEI INDIO DE BARUTA", direccion:"SANTA CRUZ DEL ESTE SECTOR CHUPULUN", codComuna:"COM_131601003", codCircuito:"C-URB-2020-01-0002", circuito:"INDIO DE BARUTA", mesa:1, cedPres:"14190006", nomPres:"CARMEN MARQUEZ", telPres:"4241258817", correoPres:"marquezjazmin249@gmail.com", cedSec:"10354815", nomSec:"YELITZA ARCIA", telSec:"4126056286", correoSec:"yelitza4556@gmail.com" },
  { centro:"ESCUELA BASICA MUNICIPAL GENERAL JOSE ANTONIO PAEZ", direccion:"BARRIO SANTA CRUZ DEL ESTE DERECHA AVENIDA RIO PARAGUA. FRENTE AVENIDA RIO PARAGUA. IZQUIERDA CALLE TRUJILLO AVENIDA RIO PARAGUA ENTRADA CALLE TRUJILLO SANTA CRUZ DEL ESTE CASA", codComuna:"COM_131601004", codCircuito:"C-URB-2019-08-0001", circuito:"CON DIOS TODO ES POSIBLE", mesa:1, cedPres:"10905784", nomPres:"YELISE FERNANDEZ", telPres:"4124470218", correoPres:"fernandezyelise@gmail.com", cedSec:"26386640", nomSec:"MARICARMEN PLAZA", telSec:"4129881330", correoSec:"maggifr2024@gmail.com" },
  { centro:"ESCUELA BASICA MUNICIPAL GENERAL JOSE ANTONIO PAEZ", direccion:"BARRIO SANTA CRUZ DEL ESTE DERECHA AVENIDA RIO PARAGUA. FRENTE AVENIDA RIO PARAGUA. IZQUIERDA CALLE TRUJILLO AVENIDA RIO PARAGUA ENTRADA CALLE TRUJILLO SANTA CRUZ DEL ESTE CASA", codComuna:"COM_131601004", codCircuito:"C-URB-2019-08-0001", circuito:"CON DIOS TODO ES POSIBLE", mesa:2, cedPres:"17507279", nomPres:"MARY VASQUEZ", telPres:"4125123486", correoPres:"margarzon1982@gmail.com", cedSec:"26282428", nomSec:"WESLIMAR MONTOYA", telSec:"4122498195", correoSec:"Mpbarutasalasituacional@gmail.com" },
  { centro:"ESCUELA BASICA NACIONAL SANTA CRUZ DEL ESTE", direccion:"BARRIO SANTA CRUZ DEL ESTE FRENTE AVENIDA RIO PARAGUA. DERECHA CALLE RIO PARAGUA. IZQUIERDA CALLE LA UNION AL LADO DEL INAS Y DISPENSARIO SANTA CRUZ DEL ESTE CASA", codComuna:"COM_131601005", codCircuito:"C-URB-2020-01-0003", circuito:"SOCIALISTA SANTA CRUZ", mesa:1, cedPres:"6810678", nomPres:"YODLYSOL LARA", telPres:"4242372979", correoPres:"henrygascon@gmail.com", cedSec:"24456645", nomSec:"DOUGLESIS RADA", telSec:"4127525708", correoSec:"douglesisrada@gmail.com" },
  { centro:"ASOCIACION DESARROLLO INTEGRAL COMUNITARIO", direccion:"URBANIZACIÓN EL PEÑON DERECHA CALLE BARUTA. IZQUIERDA CALLE ACUEDUCTO. FRENTE CALLE ACUEDUCTO CERCANO A LA BOMBA DE GASOLINA DEL PEÑON  BARUTA EDIFICIO", codComuna:"COM_131601006", codCircuito:"C-URB-2020-10-0004", circuito:"LOS PLACERES DE MARIA", mesa:1, cedPres:"5330763", nomPres:"HORTENSIA GONZALEZ", telPres:"4122559970", correoPres:"hortigon.18@gmail.com", cedSec:"6844182", nomSec:"NELLY ROSALES", telSec:"4123961210", correoSec:"rosalesnelly71@gmail.com" },
  { centro:"UNIDAD EDUCATIVA TEREPAIMA", direccion:"SECTOR EL PLACER CALLE PRINCIPAL POR EL PLACER", codComuna:"COM_131601006", codCircuito:"C-URB-2020-10-0004", circuito:"LOS PLACERES DE MARIA", mesa:2, cedPres:"8721994", nomPres:"ANA MILANEZ", telPres:"4141532292", correoPres:"anamilanesd@gmail.com", cedSec:"12172628", nomSec:"CLAUDIA DE ANDRADE", telSec:"4122498196", correoSec:"Mpbarutasalasituacional@gmail.com" },
  { centro:"CASA COMUNITARIA LOS PLACERES", direccion:"SECTOR EL PLACER CALLE PRINCIPA POR EL CALLEJON PÒLAR", codComuna:"COM_131601006", codCircuito:"C-URB-2020-10-0004", circuito:"LOS PLACERES DE MARIA", mesa:3, cedPres:"16005790", nomPres:"BEATRIZ BELLO", telPres:"4242244882", correoPres:"lagata198@gmail.com", cedSec:"29661392", nomSec:"CARDELYS BELLO", telSec:"4122122662", correoSec:"cardelysv@gmail.com" },
  { centro:"JARDIN DE INFANCIA PREESCOLAR MANUEL FELIPE RUGELES", direccion:"BARRIO LAS BRISAS DE LA PALOMERA DERECHA CALLE PRINCIPAL DE LAS BRISAS. IZQUIERDA ESCALERA LAS BRISAS. FRENTE ESCALERA LAS BRISAS 10 METROS DEL KIOSKO DE HAMBURGUESAS DEL SEÑOR ANTONIO CASA", codComuna:"COM_131601007", codCircuito:"C-MIX-2016-09-0003", circuito:"LIVIA GOUVERNEU", mesa:1, cedPres:"24697974", nomPres:"MARIA AIDE BONILLA", telPres:"4141251839", correoPres:"maydee0755@gmail.com", cedSec:"5352045", nomSec:"LOURDES LEAL", telSec:"4124295334", correoSec:"lourdesleal456@gmail.com" },
  { centro:"JARDIN DE INFANCIA DON ROMULO BENTANCOURT", direccion:"SECTOR CASCO DE BARUTA DERECHA CALLE SALOM. IZQUIERDA CALLE NEGRO PRIMERO. FRENTE CALLE BOLIVAR AL LADO DE RESTAURANT EL MUNOZ, BARUTA CASA", codComuna:"COM_131601007", codCircuito:"C-MIX-2016-09-0003", circuito:"LIVIA GOUVERNEU", mesa:2, cedPres:"6925489", nomPres:"BENITA MUÑOZ", telPres:"4125571276", correoPres:"benimunoz2166@gmail.com", cedSec:"6080346", nomSec:"NELLY HERNANDEZ", telSec:"4123099923", correoSec:"nellyhernandezdetomas@gmail.com" },
  { centro:"UNIDAD EDUCATIVA JOSE TADEO MONAGAS", direccion:"CASERÍO LAS LOMAS DERECHA CALLE VIA HACIA LAS LOMAS. FRENTE CALLE EL CUJI. IZQUIERDA CARRETERA AUTOPISTA REGIONAL DEL CENTRO KM 14 AUTOPISTA COCHE TEJERIAS EDIFICIO", codComuna:"COM_131601008", codCircuito:"CEC-MI-093", circuito:"COMUNA 13 DE ABRIL", mesa:1, cedPres:"21345182", nomPres:"YUSMELY YANEZ", telPres:"4120166191", correoPres:"penaalice96@gmail.com", cedSec:"16083173", nomSec:"LEONEL SALAZAR", telSec:"4124496227", correoSec:"leonelsalazar841@gmail.com" },
  { centro:"UNIDAD EDUCATIVA JOSE TADEO MONAGAS", direccion:"CASERÍO LAS LOMAS DERECHA CALLE VIA HACIA LAS LOMAS. FRENTE CALLE EL CUJI. IZQUIERDA CARRETERA AUTOPISTA REGIONAL DEL CENTRO KM 14 AUTOPISTA COCHE TEJERIAS EDIFICIO", codComuna:"COM_131601008", codCircuito:"CEC-MI-093", circuito:"COMUNA 13 DE ABRIL", mesa:2, cedPres:"12402965", nomPres:"LEIDY APONTE", telPres:"4127116071", correoPres:"aponteleidy1973@gmail.com", cedSec:"6130761", nomSec:"ZENAIDA ESPINOZA", telSec:"4141144763", correoSec:"zenaidadelovera@gmail.com" },
  { centro:"UNIDAD EDUCATIVA FE Y ALEGRIA COLEGIO MONTERREY", direccion:"BARRIO MONTERREY DERECHA CALLE PRINCIPAL DE MONTERREY. IZQUIERDA CALLE CALLE PRINCIPAL DE MONTERREY. FRENTE CALLE PRINCIPAL DE MONTERREY FRENTE A LA QUINCALLA MONTERREY ENTRE URBANIZACION MONTE PINO Y URBANIZACION MONTE ALTO EDIFICIO", codComuna:"COM_131601009", codCircuito:"CEC-MI-041", circuito:"JUANA RAMIREZ LA AVANZADORA I", mesa:1, cedPres:"18578018", nomPres:"ANA MARQUEZ", telPres:"4123764178", correoPres:"anitacrismar27@gmail.com", cedSec:"22358055", nomSec:"YENNY RODRIGUEZ", telSec:"4241869909", correoSec:"davina30720@gmail.com" },
  { centro:"UNIDAD EDUCATIVA FE Y ALEGRIA COLEGIO MONTERREY", direccion:"BARRIO MONTERREY DERECHA CALLE PRINCIPAL DE MONTERREY. IZQUIERDA CALLE CALLE PRINCIPAL DE MONTERREY. FRENTE CALLE PRINCIPAL DE MONTERREY FRENTE A LA QUINCALLA MONTERREY ENTRE URBANIZACION MONTE PINO Y URBANIZACION MONTE ALTO EDIFICIO", codComuna:"COM_131601009", codCircuito:"CEC-MI-041", circuito:"JUANA RAMIREZ LA AVANZADORA I", mesa:2, cedPres:"10912057", nomPres:"MARIANGELA LINARES", telPres:"4124296399", correoPres:"alefranalbornoz@gmail.com", cedSec:"23696105", nomSec:"MATILDE BOLAÑOS", telSec:"4242703834", correoSec:"matilde2904@gmail.com" },
  { centro:"CASA COMUNITARIA EL PROGRESO", direccion:"SECTOR EL PROGRESO CALLE PRINCIPAL DEL PROGRESO POR EL PROGRESO", codComuna:"COM_131601009", codCircuito:"CEC-MI-041", circuito:"JUANA RAMIREZ LA AVANZADORA I", mesa:3, cedPres:"18231822", nomPres:"YURY CAROLINA HERRRERA", telPres:"4129620463", correoPres:"carolinarengifo60@gmail.com", cedSec:"19312140", nomSec:"MILAGROS COROMOTO HERNANDEZ", telSec:"4242540831", correoSec:"milagroshernandez300988@gmail.com" },
  { centro:"MODULO DE SALUD", direccion:"SECTOR SAN PEDRO CALLE PRINCIPAL DE SAN PEDRO PEDRITO PARTE BAJA", codComuna:"COM_131601009", codCircuito:"CEC-MI-041", circuito:"JUANA RAMIREZ LA AVANZADORA I", mesa:4, cedPres:"13992306", nomPres:"KENY GUEVARA", telPres:"4126103839", correoPres:"kegg1603@gmail.com", cedSec:"14666025", nomSec:"KAREN GUEVARA", telSec:"4121147836", correoSec:"karenguevara02@gmail.com" },
  { centro:"GALPON LIMONERA PARTE BAJA", direccion:"SECTOR LOS PICAPIEDRAS CALLE PRINCIPAL DE MONTERREY POR MONTERREY", codComuna:"COM_131601009", codCircuito:"CEC-MI-041", circuito:"JUANA RAMIREZ LA AVANZADORA I", mesa:5, cedPres:"6324732", nomPres:"NELLY VEGAS", telPres:"4122588077", correoPres:"nelyvegas28@gmail.com", cedSec:"6329421", nomSec:"ROMULO MORA", telSec:"4123993960", correoSec:"r79799148@gmail.com" },
  { centro:"EL PROGRESO PARTE BAJA", direccion:"BARRIO OJO DE AGUA BARUTA IZQUIERDA CALLE PRINCIPAL DE OJO DE AGUA BARUTA. FRENTE CALLE PRINCIPAL DE OJO DE AGUA BARUTA. DERECHA CALLEJÓN PRINCIPAL DE OJO DE AGUA BARUTA FRENTE AL ABASTO DE FRANK CASA", codComuna:"COM_131601010", codCircuito:"C-URB-2020-10-0003", circuito:"HASTA LA VICTORIA POR SIEMPRE I", mesa:1, cedPres:"15273261", nomPres:"YAMILET COLMENARES", telPres:"4242342118", correoPres:"yamilethcolmenares026@gmail.com", cedSec:"4821563", nomSec:"ELBA NAVARRO", telSec:"4242232641", correoSec:"elbanavarro@gmail.com" },
  { centro:"OFICINA LA CANCHA LA ARENERA", direccion:"SECTOR LA ARENERA CALLE PRINCIPAL DE LA ARENERA POR OJO DE AGUA BARUTA", codComuna:"COM_131601010", codCircuito:"C-URB-2020-10-0003", circuito:"HASTA LA VICTORIA POR SIEMPRE I", mesa:2, cedPres:"11231827", nomPres:"CARINA BELLO", telPres:"4249739244", correoPres:"carinabello021@gmail.com", cedSec:"28155993", nomSec:"DESIREE PIMENTEL", telSec:"4242855931", correoSec:"desiipimentel26@gmail.com" },
  { centro:"UNIDAD EDUCATIVA RURAL MANUELITA SAENZ", direccion:"CASERÍO LA PLANADA IZQUIERDA CALLE CONTINUACION CALLE LA LIBERTAD. FRENTE CALLE LA LIBERTAD. DERECHA CALLEJÓN VIA AUTOPISTA REGIONAL DEL CENTRO SECTOR LA PLANADA CASA", codComuna:"COM_131601011", codCircuito:"CEC-MI-039", circuito:"VOCES LIBERTARIAS", mesa:1, cedPres:"17352117", nomPres:"NIEVE RUSYN", telPres:"4122082982", correoPres:"aorrderunin@gmail.com", cedSec:"26282401", nomSec:"YAIDELIN PLAZA", telSec:"4242566816", correoSec:"yaidelinplaza577@gmail.com" },
  { centro:"PREESCOLAR GUSTAVO ARISMENDI ITURBE", direccion:"CASERÍO LAS LOMAS DERECHA CALLE LAS LOMAS. FRENTE CALLE LAS LOMAS. IZQUIERDA CARRETERA AUTOPISTA REGIONAL DEL CENTRO FRENTE DEL DISPENSARIO LAS LOMAS CASA", codComuna:"COM_131601012", codCircuito:"C-MIX-2021-05-0013", circuito:"LAS LOMAS SOCIALISTA", mesa:1, cedPres:"18031337", nomPres:"ANA RAMIREZ", telPres:"4121349734", correoPres:"anaramirez2359@gmail.com", cedSec:"6020355", nomSec:"MARIA ORTEGA", telSec:"4242516667", correoSec:"maridelina59@gmail.com" },
  { centro:"UEE LOMAS BAJA", direccion:"AUTOPISTA REGIONAL DEL CENTRO HOYO DE LA PUERTA. SECTOR LOMAS BAJA.", codComuna:"COM_131601012", codCircuito:"C-MIX-2021-05-0013", circuito:"LAS LOMAS SOCIALISTA", mesa:2, cedPres:"14687725", nomPres:"EISLEN FARFAN", telPres:"4241462308", correoPres:"psuvsituacional25@gmail.com", cedSec:"16869919", nomSec:"YOSELIN BOADA", telSec:"4242568247", correoSec:"yoselirorut@gmail.com" },
  { centro:"MODULO DE SALUD MANUELITA SAEZ", direccion:"SECTOR LA LOMA CALLE PRINCIPAL DE LA LOMA POR HOYO DE LA PUERTA", codComuna:"COM_131601012", codCircuito:"C-MIX-2021-05-0013", circuito:"LAS LOMAS SOCIALISTA", mesa:3, cedPres:"29776400", nomPres:"JAIRO PEINADO", telPres:"4242919093", correoPres:"jairopeinado64@gamil.com", cedSec:"12258383", nomSec:"ANA FERNANDEZ", telSec:"4125407227", correoSec:"ana3311fernandez@gmail.com" },
  { centro:"CENTRO DE EDUCACION INICIAL NACIONAL SIMONCITO EZEQUIEL ZAMORA", direccion:"URBANIZACIÓN A VIVIR LA LIMONERA DERECHA AVENIDA LA LIMONERA. IZQUIERDA AVENIDA LA LIMONERA. FRENTE AVENIDA LA LIMONERA 200 METROS DE LA ENTRADA DEL URBANISMO LA LIMONERA EDIFICIO", codComuna:"COM_131601013", codCircuito:"C-URB-2017-12-0002", circuito:"A VIVIR LA LIMONERA", mesa:1, cedPres:"14422372", nomPres:"YETZI DEL VALLE RIVAS", telPres:"4129639774", correoPres:"YETZI4.2RIVAS@GMAIL.COM", cedSec:"17642085", nomSec:"ROSELENA GARCIA", telSec:"4164075919", correoSec:"Mpbarutasalasituacional@gmail.com" },
  { centro:"CENTRO DE EDUCACION INICIAL NACIONAL SIMONCITO EZEQUIEL ZAMORA", direccion:"URBANIZACIÓN A VIVIR LA LIMONERA DERECHA AVENIDA LA LIMONERA. IZQUIERDA AVENIDA LA LIMONERA. FRENTE AVENIDA LA LIMONERA 200 METROS DE LA ENTRADA DEL URBANISMO LA LIMONERA EDIFICIO", codComuna:"COM_131601013", codCircuito:"C-URB-2017-12-0002", circuito:"A VIVIR LA LIMONERA", mesa:2, cedPres:"18486440", nomPres:"YESSICA MEZA", telPres:"4129624401", correoPres:"Mpbarutasalasituacional@gmail.com", cedSec:"19087462", nomSec:"LILAMAR DELGADO", telSec:"4125411498", correoSec:"Mpbarutasalasituacional@gmail.com" },
  { centro:"GALPON DE SAN LUIS", direccion:"SECTOR SAN LUIS CALLE PRINCIPAL HOYO DE LA PUERTA PARTE ALTA DE SAN LUIS", codComuna:"COM_131601014", codCircuito:"C-MIX-2016-02-0002", circuito:"MIL GRULLAS", mesa:1, cedPres:"17641852", nomPres:"EDITH VELASQUEZ", telPres:"4143894916", correoPres:"diosmarybarrio7@gmai.com", cedSec:"26511808", nomSec:"ROSMARY URBINA", telSec:"4149110469", correoSec:"rosmaryurbina552@gmail.com" },
  { centro:"CDI HOYO DE LA PUERTA", direccion:"REDOMA HOYO DE LA PUERTA AVENIDA PRINCIPAL HOYO DE LA PUERTA LA REDOMA", codComuna:"COM_131601014", codCircuito:"C-MIX-2016-02-0002", circuito:"MIL GRULLAS", mesa:2, cedPres:"14675438", nomPres:"MARTHA ESPINOZA", telPres:"4242161458", correoPres:"katylugo94786@gmail.com", cedSec:"21091168", nomSec:"ISAMAR BOGADO", telSec:"4129603676", correoSec:"ysamarbogado245@gmail.com" },
  { centro:"SEDE COMUNITARIA SECTOR EL CAFÉ", direccion:"HOYO DE LA PUERTA, AVENIDA PRINCIPAL SECTOR EL CAFÉ SEDE COMUNITARIA", codComuna:"COM_131601014", codCircuito:"C-MIX-2016-02-0002", circuito:"MIL GRULLAS", mesa:3, cedPres:"12689086", nomPres:"DAINE VELASQUEZ", telPres:"4142291418", correoPres:"daineilise@gmail.com", cedSec:"17583119", nomSec:"ALICIA BENAMENTA", telSec:"4120129994", correoSec:"benamentamarelis@gmail.com" },
  { centro:"SECTOR LA PARED", direccion:"HOYO LA PUERTA, SECTOR LA PARED", codComuna:"COM_131601015", codCircuito:"C-MIX-2021-05-0011", circuito:"LOS OJOS DE CHAVEZ", mesa:1, cedPres:"21165158", nomPres:"MARILUZ FERREBUS", telPres:"4246213744", correoPres:"Mpbarutasalasituacional@gmail.com", cedSec:"5061491", nomSec:"JOSE TORO", telSec:"4143172719", correoSec:"Mpbarutasalasituacional@gmail.com" },
  { centro:"MODULO DE SERVICIO DE OJO DE AGUA", direccion:"BARRIO OJO DE AGUA BARUTA IZQUIERDA CALLE PRINCIPAL DE OJO DE AGUA BARUTA. FRENTE CALLE PRINCIPAL DE OJO DE AGUA BARUTA. DERECHA CALLEJÓN PRINCIPAL DE OJO DE AGUA BARUTA FRENTE AL ABASTO DE FRANK CASA", codComuna:"COM_131601016", codCircuito:"C-URB-2020-10-0002", circuito:"HASTA LA VICTORIA POR SIEMPRE", mesa:1, cedPres:"22758561", nomPres:"NEMECIO JESUS OROZCO (YA SE ENCUENTRA REGISTRADO EN SISTEMA)", telPres:"4122157908", correoPres:"noraidabarreto@gmail.com", cedSec:"6810463", nomSec:"NORAIDA BARRETO", telSec:"4123884585", correoSec:"Mpbarutasalasituacional@gmail.com" },
  { centro:"CASA COMUNAL LA PLANADA", direccion:"SECTOR LA PLANADA CALLE PRINCIPAL LA PLANADA OJO DE AGUA BARUTA", codComuna:"COM_131601016", codCircuito:"C-URB-2020-10-0002", circuito:"HASTA LA VICTORIA POR SIEMPRE", mesa:2, cedPres:"10509276", nomPres:"LUIS GALLARDO", telPres:"4242304871", correoPres:"soysantero2008@gmail.com", cedSec:"7162982", nomSec:"XIOMARA HERRERA", telSec:"4129108548", correoSec:"xiomarah984@gmail.com" },
  { centro:"ESCUELA NACIONAL JESUS MARIA ALFARO ZAMORA", direccion:"URBANIZACIÓN EL CAFETAL IZQUIERDA AVENIDA PRINCIPAL DEL CAFETAL. FRENTE AVENIDA PRINCIPAL DEL CAFETAL. DERECHA CALLE EL MORAO AL LADO DE LA CANTV URBANIZACION EL CAFETAL. CASA", codComuna:"COM_131602001", codCircuito:"CEC-MI-044", circuito:"CAFETAL", mesa:1, cedPres:"3821490", nomPres:"MIRIAN MARIÑA", telPres:"4120879745", correoPres:"mirianmarina14@gmail.com", cedSec:"10977263", nomSec:"JUAN ZAA", telSec:"4128000405", correoSec:"zaajuan65@gmail.com" },
  { centro:"ESCUELA NACIONAL JESUS MARIA ALFARO ZAMORA", direccion:"URBANIZACIÓN EL CAFETAL IZQUIERDA AVENIDA PRINCIPAL DEL CAFETAL. FRENTE AVENIDA PRINCIPAL DEL CAFETAL. DERECHA CALLE EL MORAO AL LADO DE LA CANTV URBANIZACION EL CAFETAL. CASA", codComuna:"COM_131602001", codCircuito:"CEC-MI-044", circuito:"CAFETAL", mesa:2, cedPres:"13476622", nomPres:"SANDRA RIVERO", telPres:"4122118105", correoPres:"psuvsituacional25@gmail.com", cedSec:"4352212", nomSec:"HENRY TOVAR", telSec:"4241565440", correoSec:"Mpbarutasalasituacional@gmail.com" },
  { centro:"UNIDAD EDUCATIVA ESTADAL  ADOLFO NAVAS  CORONADO", direccion:"SECTOR EL RELLENO DERECHA CALLE EL RELLENO. IZQUIERDA CALLE EL RELLENO. FRENTE CALLE EL RELLENO SECTOR EL RELLENO CALLE  LA PEDRERA CASA", codComuna:"COM_131603001", codCircuito:"C-MIX-2018-04-0008", circuito:"JUSTICIA E IGUALDAD", mesa:1, cedPres:"19692786", nomPres:"MARIA LOPEZ", telPres:"4269126667", correoPres:"mariayudithlopez@gmail.com", cedSec:"12057260", nomSec:"LENNY APONTE", telSec:"4242429761", correoSec:"lennyaponte41@gmail.com" },
  { centro:"UNIDAD EDUCATIVA ESTADAL  ADOLFO NAVAS  CORONADO", direccion:"SECTOR EL RELLENO DERECHA CALLE EL RELLENO. IZQUIERDA CALLE EL RELLENO. FRENTE CALLE EL RELLENO SECTOR EL RELLENO CALLE  LA PEDRERA CASA", codComuna:"COM_131603001", codCircuito:"C-MIX-2018-04-0008", circuito:"JUSTICIA E IGUALDAD", mesa:2, cedPres:"16227867", nomPres:"ANA MORALES", telPres:"4129521154", correoPres:"amoaminieto@gmail.com", cedSec:"12763837", nomSec:"YADIRA CORDERO", telSec:"4267261902", correoSec:"yadira.cordero.1626@gmail.com" },
  { centro:"REGISTRO CIVIL DE LA PARROQUIA LAS MINAS", direccion:"SECTOR LOS MANGUITOS DERECHA CARRETERA VIEJA CARACAS  BARUTA. IZQUIERDA CARRETERA VIEJA CARACAS  BARUTA. FRENTE CARRETERA VIEJA CARACAS BARUTA CARRETERA VIEJA CARACAS BARUTA SECTOR LOS MANGUITOS ANTIGUA SEDE PTJ CASA", codComuna:"COM_131603001", codCircuito:"C-MIX-2018-04-0008", circuito:"JUSTICIA E IGUALDAD", mesa:3, cedPres:"6682320", nomPres:"MAIRET LOPEZ", telPres:"4142778851", correoPres:"lopezmairet316@gmail.com", cedSec:"6218780", nomSec:"MARIA HERRERA", telSec:"4129182643", correoSec:"lopezmoiret316@gmail.com" },
  { centro:"REGISTRO CIVIL DE LA PARROQUIA LAS MINAS", direccion:"SECTOR LOS MANGUITOS DERECHA CARRETERA VIEJA CARACAS  BARUTA. IZQUIERDA CARRETERA VIEJA CARACAS  BARUTA. FRENTE CARRETERA VIEJA CARACAS BARUTA CARRETERA VIEJA CARACAS BARUTA SECTOR LOS MANGUITOS ANTIGUA SEDE PTJ CASA", codComuna:"COM_131603001", codCircuito:"C-MIX-2018-04-0008", circuito:"JUSTICIA E IGUALDAD", mesa:4, cedPres:"10817159", nomPres:"KARELIS TIAPA", telPres:"4123752028", correoPres:"karelis.tiapa@gmail.com", cedSec:"11681021", nomSec:"ELI GALINDO", telSec:"4242823391", correoSec:"eli.galindo72@gmail.com" },
  { centro:"CASA DE LA GOBERNACION", direccion:"CALLE COLEGIO AMERICANO REDOMA DE LAS.MINAS DE BARUTA", codComuna:"COM_131603001", codCircuito:"C-MIX-2018-04-0008", circuito:"JUSTICIA E IGUALDAD", mesa:5, cedPres:"13924256", nomPres:"YAMILETH MAYZ", telPres:"4261181793", correoPres:"tamimayz.7@gmail.com", cedSec:"13395334", nomSec:"ERIKA ACOSTA", telSec:"4120153454", correoSec:"erika0512ricardo@gmail.com" },
  { centro:"UNIDAD EDUCATIVA NACIONAL TITO SALAS", direccion:"URBANIZACIÓN LAS TERRAZAS  DEL CLUB HIPICO FRENTE CALLE PANAMA. DERECHA CALLEJÓN SAN RAFAEL. IZQUIERDA ESCALERA TITO SALAS FINAL CALLE PANAMA TERRAZAS DEL CLUB HIPICO EDIFICIO", codComuna:"COM_131603002", codCircuito:"C-URB-2018-11-0045", circuito:"PRIMERA FORTALEZA DEL ROSARIO", mesa:1, cedPres:"16007754", nomPres:"LEIDY DELGADO", telPres:"4122127948", correoPres:"delgadoleidy385@gmail.com", cedSec:"16274433", nomSec:"AMAURI DIAZ", telSec:"4241915427", correoSec:"maurisari222@gmail.com" },
  { centro:"CEI EL ROSARIO", direccion:"LAS MINAS DE BARUTA CALLE EL ROSARIO. 1ERA TRANSVERSAL DEL ROSARIO.", codComuna:"COM_131603002", codCircuito:"C-URB-2018-11-0045", circuito:"PRIMERA FORTALEZA DEL ROSARIO", mesa:2, cedPres:"6496500", nomPres:"AURA INFANTE", telPres:"4264151727", correoPres:"aurajosefina1966@gmail.com", cedSec:"28472730", nomSec:"YOSELIN MARTINEZ", telSec:"4126051508", correoSec:"gaby11040102@gmail.com" },
  { centro:"ESCUELA BASICA NACIONAL  LAS MINITAS", direccion:"BARRIO LAS MINITAS FRENTE CALLE MARA. DERECHA CALLEJÓN 3. IZQUIERDA CALLEJÓN 1 CARRETERA VIEJA LAS MINAS ZONA INDUSTRIAL LA NAYA CALLE MARA CENTRO COMERCIAL", codComuna:"COM_131603003", codCircuito:"C-URB-2015-06-0001", circuito:"HUGO CHAVEZ FRIAS", mesa:1, cedPres:"17079656", nomPres:"DANIEL FRANCISCO LUCINCHI SÁNCHEZ", telPres:"4141211864", correoPres:"psuvsituacional25@gmail.com", cedSec:"14384944", nomSec:"OLGA MERIÑO", telSec:"4144662248", correoSec:"olgamerino1980@gmail.com" },
  { centro:"LAS MINITAS PARTE BAJA", direccion:"LAS MINAS DE BARUTA, SECTOR LAS MINITAS PARTE BAJA", codComuna:"COM_131603003", codCircuito:"C-URB-2015-06-0001", circuito:"HUGO CHAVEZ FRIAS", mesa:2, cedPres:"10839941", nomPres:"YELITZA RODRIGUEZ", telPres:"4242085576", correoPres:"yelitzarodriguez7019@gmail.com", cedSec:"14111420", nomSec:"RUSBELYS ALVAREZ", telSec:"4241991514", correoSec:"Mpbarutasalasituacional@gmail.com" },
  { centro:"CASA COMUNITARIA HUGO CHAVEZ FRIAS EL GUIRE", direccion:"SECTOR EL GUIRE CALLE PRINCIPAL DE SANTA FE AUTOPISTA SANTA FE", codComuna:"COM_131603003", codCircuito:"C-URB-2015-06-0001", circuito:"HUGO CHAVEZ FRIAS", mesa:3, cedPres:"15396903", nomPres:"JOCSELIN RODRIGUEZ", telPres:"4120120231", correoPres:"oaeartesamorda2022@gmail.com", cedSec:"9064595", nomSec:"JESUS SALINAS", telSec:"4241754125", correoSec:"salinasjesusa@gmail.com" },
  { centro:"ESCUELA MUNICIPAL BARBARO RIVAS", direccion:"BARRIO LA CAPILLA CALLE EL ROSARIO DERECHA CALLE EL ROSARIO. IZQUIERDA CALLE EL ROSARIO. FRENTE CALLE EL ROSARIO AL LADO DEL MODULO DE LA POLICIA MUNICIPAL DE BARUTA EDIFICIO", codComuna:"COM_131603004", codCircuito:"C-URB-2018-04-0003", circuito:"FUERZA Y LUCHA POPULAR DEL ROSARIO", mesa:1, cedPres:"12522271", nomPres:"MARIO NEL MURILLO", telPres:"4142761020", correoPres:"marionelmurillo03@gmail.com", cedSec:"6211639", nomSec:"YOLANDA MELO", telSec:"4163044547", correoSec:"yolandamelo47@gmail.com" },
  { centro:"PRESCOLAR MARIA TERESA DEL TORO DE BOLIVAR", direccion:"LAS MINAS DE BARUTA CALLE EL ROSARIO. FINAL DEL ROSARIO.", codComuna:"COM_131603004", codCircuito:"C-URB-2018-04-0003", circuito:"FUERZA Y LUCHA POPULAR DEL ROSARIO", mesa:2, cedPres:"15337487", nomPres:"YUNAIDE PEÑA", telPres:"4124427708", correoPres:"yuneidepena@gmail.com", cedSec:"12764039", nomSec:"GIGIOLA FIGUEROA", telSec:"4141221608", correoSec:"gigifigueroa1608@gmail.com" },
  { centro:"BASE DE MISIONES FUERZA Y LUCHA", direccion:"SECTOR EL ROSARIO CALLE PRINCIPAL DEL ROSARIO FRENTE A LA CAPILLA", codComuna:"COM_131603004", codCircuito:"C-URB-2018-04-0003", circuito:"FUERZA Y LUCHA POPULAR DEL ROSARIO", mesa:3, cedPres:"9972217", nomPres:"RICHARD YANEZ", telPres:"4129858644", correoPres:"yanezrichard60@gmail.com", cedSec:"21626549", nomSec:"YOREIDIS JIMENEZ", telSec:"4125011870", correoSec:"yoreidisjimenez@gmail.com" },
];

function buildMesas(raw) {
  const groups = {};
  raw.forEach((m) => {
    if (!groups[m.centro]) groups[m.centro] = { centro: m.centro, direccion: m.direccion, circuito: m.circuito, codCircuito: m.codCircuito, codComuna: m.codComuna, mesas: [] };
    groups[m.centro].mesas.push(m);
  });
  return Object.values(groups).sort((a, b) => a.centro.localeCompare(b.centro));
}
const CENTROS_MESA = buildMesas(RAW_MESAS);

const LAST = CONSULTAS.length - 1;

function buildUnit(u) {
  const mejorVotacion = Math.max(...u.votos);
  const peorVotacion = Math.min(...u.votos);
  const mejorIdx = u.votos.indexOf(mejorVotacion);
  const peorIdx = u.votos.indexOf(peorVotacion);
  const votoActual = u.votos[LAST];
  const pctMeta = (votoActual / u.meta) * 100;
  const brecha = Math.max(0, u.meta - votoActual);
  const distanciaMeta = Math.abs(u.meta - votoActual);
  let estado = "rojo";
  if (pctMeta >= 100) estado = "verde";
  else if (pctMeta >= 50) estado = "amarillo";
  return {
    ...u, mejorVotacion, peorVotacion,
    mejorConsulta: CONSULTAS[mejorIdx].label, peorConsulta: CONSULTAS[peorIdx].label,
    votoActual, pctMeta, brecha, distanciaMeta, estado,
  };
}

const UNITS = RAW_UNITS.map(buildUnit);

function aggregateUnits(units, nombre) {
  if (!units.length) {
    return { nombre, votos: CONSULTAS.map(() => 0), meta: 0, mejorVotacion: 0, peorVotacion: 0, mejorConsulta: "—", peorConsulta: "—", votoActual: 0, pctMeta: 0, brecha: 0, distanciaMeta: 0, estado: "rojo" };
  }
  const votos = CONSULTAS.map((_, i) => units.reduce((s, u) => s + u.votos[i], 0));
  const meta = units.reduce((s, u) => s + u.meta, 0);
  const mejorVotacion = Math.max(...votos);
  const peorVotacion = Math.min(...votos);
  const mejorConsulta = CONSULTAS[votos.indexOf(mejorVotacion)].label;
  const peorConsulta = CONSULTAS[votos.indexOf(peorVotacion)].label;
  const votoActual = votos[LAST];
  const pctMeta = meta ? (votoActual / meta) * 100 : 0;
  let estado = "rojo";
  if (pctMeta >= 100) estado = "verde"; else if (pctMeta >= 50) estado = "amarillo";
  return {
    nombre, votos, meta, mejorVotacion, peorVotacion, mejorConsulta, peorConsulta,
    votoActual, pctMeta, brecha: Math.max(0, meta - votoActual), distanciaMeta: Math.abs(meta - votoActual), estado,
  };
}

const fmt = (n) => Math.round(n).toLocaleString("es-VE");
const fmtPct = (n) => `${n.toFixed(1)}%`;

const COLORS = {
  verde: "#22C55E", amarillo: "#F59E0B", rojo: "#EF4444",
  blue: "#3B82F6", cyan: "#0891B2",
};

/* ----------------------------- TEMA ----------------------------- */
const THEMES = {
  dark: {
    name: "dark",
    bg: "#060B16", panel: "#0D1526", panelAlt: "#0B1220", border: "#1E293B",
    sidebar: "#080D1A", header: "rgba(6,11,22,0.9)", input: "#0A0F1D",
    textPrimary: "#F1F5F9", textSecondary: "#94A3B8", textMuted: "#64748B",
    hover: "rgba(30,41,59,0.4)", chartGrid: "#1E293B", chartMuted: "#64748B",
  },
  light: {
    name: "light",
    bg: "#EEF2F7", panel: "#FFFFFF", panelAlt: "#F8FAFC", border: "#E2E8F0",
    sidebar: "#FFFFFF", header: "rgba(255,255,255,0.88)", input: "#F1F5F9",
    textPrimary: "#0F172A", textSecondary: "#475569", textMuted: "#94A3B8",
    hover: "rgba(226,232,240,0.7)", chartGrid: "#E2E8F0", chartMuted: "#94A3B8",
  },
};
const ThemeCtx = createContext(THEMES.dark);
const useT = () => useContext(ThemeCtx);

const estadoStyle = {
  verde:    { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/30", label: "META CUMPLIDA", Icon: CheckCircle2 },
  amarillo: { bg: "bg-amber-500/10",   text: "text-amber-400",   ring: "ring-amber-500/30",   label: "EN PROGRESO",  Icon: AlertTriangle },
  rojo:     { bg: "bg-rose-500/10",    text: "text-rose-400",    ring: "ring-rose-500/30",    label: "ALERTA BAJA",  Icon: XCircle },
};

/* ----------------------------- SUBCOMPONENTES ----------------------------- */

function Sparkline({ data, color }) {
  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.map((v, i) => ({ i, v }))}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function KpiCard({ label, value, sub, icon: Icon, sparkData, color, progress }) {
  const T = useT();
  return (
    <div className="relative rounded-xl p-5 overflow-hidden group transition-all duration-300" style={{ background: T.panel, border: `1px solid ${T.border}` }}>
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-3xl opacity-20" style={{ background: color }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] tracking-widest font-medium uppercase" style={{ color: T.textMuted }}>{label}</p>
          <p className="mt-2 text-2xl font-semibold font-mono tabular-nums truncate max-w-[180px]" style={{ color: T.textPrimary }}>{value}</p>
          {sub && <p className="mt-1 text-xs truncate max-w-[190px]" style={{ color: T.textSecondary }}>{sub}</p>}
        </div>
        <div className="rounded-lg p-2 shrink-0" style={{ background: `${color}1A`, boxShadow: `inset 0 0 0 1px ${color}33` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      {sparkData ? (
        <div className="mt-3"><Sparkline data={sparkData} color={color} /></div>
      ) : (
        <div className="mt-3 h-1.5 w-full rounded-full overflow-hidden" style={{ background: T.border }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, progress)}%`, background: color }} />
        </div>
      )}
    </div>
  );
}

function Hexagon({ unit, onSelect, isSelected }) {
  const T = useT();
  return (
    <button
      onClick={() => onSelect(unit)}
      className="relative cursor-pointer transition-all duration-300 hover:scale-110"
      style={{ width: 52, height: 60, transform: isSelected ? "scale(1.15)" : undefined, zIndex: isSelected ? 10 : 1 }}
      title={unit.nombre}
    >
      <div
        className="w-full h-full flex items-center justify-center text-[9px] font-mono font-semibold"
        style={{
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: `linear-gradient(160deg, ${COLORS[unit.estado]}30, ${T.panel})`,
          border: `1px solid ${COLORS[unit.estado]}${isSelected ? "" : "55"}`,
          outline: isSelected ? `2px solid ${COLORS[unit.estado]}` : "none",
        }}
      >
        <span style={{ color: COLORS[unit.estado] }}>{Math.round(unit.pctMeta)}%</span>
      </div>
    </button>
  );
}

function SelectPill({ value, onChange, options, placeholder }) {
  const T = useT();
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
        style={{ background: T.input, border: `1px solid ${T.border}`, color: T.textPrimary }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronRight size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" style={{ color: T.textMuted }} />
    </div>
  );
}

function EstadoBadge({ estado }) {
  const s = estadoStyle[estado];
  const Icon = s.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ring-1 ${s.bg} ${s.text} ${s.ring}`}>
      <Icon size={11} /> {s.label}
    </span>
  );
}

function Panel({ children, className = "", noPadding = false }) {
  const T = useT();
  return <div className={`rounded-xl ${noPadding ? "" : "p-5"} ${className}`} style={{ background: T.panel, border: `1px solid ${T.border}` }}>{children}</div>;
}

function DeltaTable({ total }) {
  const T = useT();
  const rows = CONSULTAS.map((c, i) => {
    const votos = total.votos[i];
    if (i === 0) return { label: c.label, votos, delta: null, deltaPct: null };
    const prev = total.votos[i - 1];
    const delta = votos - prev;
    const deltaPct = prev === 0 ? null : (delta / prev) * 100;
    return { label: c.label, votos, delta, deltaPct };
  });
  return (
    <div className="rounded-lg overflow-hidden mt-4" style={{ border: `1px solid ${T.border}`, background: T.panelAlt }}>
      <table className="w-full text-xs">
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.border}` }}>
            <th className="px-3 py-2 text-left font-semibold" style={{ color: T.textMuted }}>CONSULTA</th>
            <th className="px-3 py-2 text-right font-semibold" style={{ color: T.textMuted }}>VOTOS</th>
            <th className="px-3 py-2 text-right font-semibold" style={{ color: T.textMuted }}>Δ ABSOLUTA</th>
            <th className="px-3 py-2 text-right font-semibold" style={{ color: T.textMuted }}>Δ %</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} style={{ borderBottom: `1px solid ${T.border}` }}>
              <td className="px-3 py-2 font-medium" style={{ color: T.textSecondary }}>{r.label}</td>
              <td className="px-3 py-2 text-right font-mono" style={{ color: T.textPrimary }}>{fmt(r.votos)}</td>
              <td className="px-3 py-2 text-right font-mono" style={{ color: r.delta == null ? T.textMuted : r.delta >= 0 ? COLORS.verde : COLORS.rojo }}>
                {r.delta == null ? "—" : `${r.delta >= 0 ? "+" : ""}${fmt(r.delta)}`}
              </td>
              <td className="px-3 py-2 text-right font-mono" style={{ color: r.deltaPct == null ? T.textMuted : r.deltaPct >= 0 ? COLORS.verde : COLORS.rojo }}>
                {r.deltaPct == null ? "—" : `${r.deltaPct >= 0 ? "+" : ""}${r.deltaPct.toFixed(1)}%`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------- VELAS JAPONESAS ------------------------- */
// Cada consulta se representa como una vela: apertura = resultado de la consulta
// anterior, cierre = resultado de la consulta actual. Vela verde = crecimiento
// respecto a la consulta anterior, vela roja = retroceso. La línea punteada
// marca la meta asignada.
function buildCandles(votos) {
  return CONSULTAS.map((c, i) => {
    const open = i === 0 ? votos[0] : votos[i - 1];
    const close = votos[i];
    return { label: c.label, open, close, high: Math.max(open, close), low: Math.min(open, close) };
  });
}

function CandlestickChart({ votos, meta, height = 280 }) {
  const T = useT();
  const data = buildCandles(votos);
  const width = 760;
  const padding = { top: 18, right: 16, bottom: 26, left: 46 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const allValues = data.flatMap((d) => [d.high, d.low]).concat(meta ? [meta] : []);
  const maxV = Math.max(...allValues) * 1.08;
  const minV = Math.min(0, ...allValues) * 0.92;
  const y = (v) => padding.top + innerH - ((v - minV) / (maxV - minV || 1)) * innerH;
  const bw = innerW / data.length;
  const candleW = Math.max(8, Math.min(26, bw * 0.46));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const yy = padding.top + innerH * t;
        const val = maxV - (maxV - minV) * t;
        return (
          <g key={t}>
            <line x1={padding.left} x2={width - padding.right} y1={yy} y2={yy} stroke={T.chartGrid} strokeDasharray="3 3" />
            <text x={padding.left - 8} y={yy + 3} textAnchor="end" fontSize="9" fill={T.chartMuted} fontFamily="'JetBrains Mono', monospace">{fmt(val)}</text>
          </g>
        );
      })}
      {meta ? (
        <g>
          <line x1={padding.left} x2={width - padding.right} y1={y(meta)} y2={y(meta)} stroke={COLORS.amarillo} strokeDasharray="5 3" strokeWidth={1.5} />
          <text x={width - padding.right} y={y(meta) - 5} textAnchor="end" fontSize="9" fontWeight="600" fill={COLORS.amarillo}>META {fmt(meta)}</text>
        </g>
      ) : null}
      {data.map((d, i) => {
        const cx = padding.left + bw * i + bw / 2;
        const up = d.close >= d.open;
        const color = up ? COLORS.verde : COLORS.rojo;
        const bodyTop = y(Math.max(d.open, d.close));
        const bodyBottom = y(Math.min(d.open, d.close));
        const bodyH = Math.max(2.5, bodyBottom - bodyTop);
        return (
          <g key={d.label}>
            <line x1={cx} x2={cx} y1={y(d.high)} y2={y(d.low)} stroke={color} strokeWidth={1.4} />
            <rect x={cx - candleW / 2} y={bodyTop} width={candleW} height={bodyH} fill={color} rx={1.5} opacity={0.92}>
              <title>{`${d.label} · apertura ${fmt(d.open)} · cierre ${fmt(d.close)}`}</title>
            </rect>
            <text x={cx} y={height - 8} textAnchor="middle" fontSize="9" fill={T.chartMuted} fontFamily="'JetBrains Mono', monospace">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ----------------------------- RANKING DE COMUNAS ----------------------------- */
function RankedList({ title, icon: Icon, color, items, valueFn }) {
  const T = useT();
  return (
    <div className="rounded-lg p-3 h-full" style={{ border: `1px solid ${T.border}`, background: T.panelAlt }}>
      <p className="text-[11px] font-semibold mb-2.5 flex items-center gap-1.5 uppercase tracking-wide" style={{ color }}>
        <Icon size={12} /> {title}
      </p>
      <div className="space-y-1.5">
        {items.length ? items.map((u, idx) => (
          <div key={u.nombre} className="flex items-center justify-between gap-2 text-[11px]">
            <span className="flex items-center gap-1.5 min-w-0" style={{ color: T.textSecondary }}>
              <span className="font-mono shrink-0" style={{ color: T.textMuted }}>{idx + 1}.</span>
              <span
                className="shrink-0 rounded px-1 py-[1px] text-[8px] font-semibold tracking-wide"
                style={u.tipo === "COMUNA"
                  ? { color: "#60A5FA", background: "rgba(59,130,246,0.12)" }
                  : { color: "#22D3EE", background: "rgba(34,211,238,0.12)" }}
              >
                {u.tipo === "COMUNA" ? "COM" : "CIR"}
              </span>
              <span className="truncate" title={u.nombre}>{u.nombre}</span>
            </span>
            <span className="font-mono shrink-0" style={{ color }}>{valueFn(u)}</span>
          </div>
        )) : <p className="text-[11px]" style={{ color: T.textMuted }}>— Sin datos —</p>}
      </div>
    </div>
  );
}

/* ----------------------------- TABS ----------------------------- */

function TabResumen({ units, total, grandTotal, onSelectUnit, selectedNombre }) {
  const T = useT();
  const [vistaSel, setVistaSel] = useState("area");
  const [vistaGeneral, setVistaGeneral] = useState("velas");
  const chartData = CONSULTAS.map((c, i) => ({ name: c.label, votos: total.votos[i] }));
  const avgPct = units.length ? units.reduce((s, u) => s + u.pctMeta, 0) / units.length : 0;
  const bestUnit = units.length ? [...units].sort((a, b) => b.pctMeta - a.pctMeta)[0] : null;

  const [rankScope, setRankScope] = useState("todos");
  const rankUniverso = UNITS.filter((u) => rankScope === "todos" || (rankScope === "comuna" && u.tipo === "COMUNA") || (rankScope === "circuito" && u.tipo === "CIRCUITO ELECTORAL"));
  const nComunas = UNITS.filter((u) => u.tipo === "COMUNA").length;
  const nCircuitos = UNITS.filter((u) => u.tipo === "CIRCUITO ELECTORAL").length;
  const masVotadas = [...rankUniverso].sort((a, b) => b.votoActual - a.votoActual).slice(0, 5);
  const menosVotadas = [...rankUniverso].sort((a, b) => a.votoActual - b.votoActual).slice(0, 5);
  const masCercanas = [...rankUniverso].sort((a, b) => a.distanciaMeta - b.distanciaMeta).slice(0, 5);
  const masLejanas = [...rankUniverso].sort((a, b) => b.brecha - a.brecha).slice(0, 5);

  const ViewToggle = ({ value, onChange }) => (
    <div className="flex items-center rounded-lg p-0.5" style={{ background: T.input, border: `1px solid ${T.border}` }}>
      {[{ id: "area", label: "Área" }, { id: "velas", label: "Velas" }].map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide transition-all duration-200"
          style={value === o.id ? { background: "rgba(59,130,246,0.15)", color: "#60A5FA" } : { color: T.textMuted }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Votos Última Consulta" value={fmt(total.votoActual)} sub={`Meta asignada: ${fmt(total.meta)}`} icon={Users} color={COLORS.blue} sparkData={total.votos} />
        <KpiCard label="Cumplimiento de Meta" value={fmtPct(total.pctMeta)} sub={`${total.nombre} · MAR 2026`} icon={Target} color={total.pctMeta >= 100 ? COLORS.verde : total.pctMeta >= 50 ? COLORS.amarillo : COLORS.rojo} progress={total.pctMeta} />
        <KpiCard label="Cumplimiento Promedio" value={fmtPct(avgPct)} sub={`Promedio de ${units.length} unidad(es)`} icon={Activity} color="#0891B2" progress={avgPct} />
        <KpiCard label="Mayor Movilización" value={bestUnit ? bestUnit.nombre : "—"} sub={bestUnit ? `${fmtPct(bestUnit.pctMeta)} de cumplimiento` : "Sin datos"} icon={MapPinned} color={COLORS.verde} progress={bestUnit ? bestUnit.pctMeta : 0} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Panel className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold tracking-wide" style={{ color: T.textPrimary }}>EVOLUCIÓN HISTÓRICA · {total.nombre}</h3>
              <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>
                {vistaSel === "area" ? "Comparativa de votos totales entre consultas, 2024–2026" : "Cada vela compara el resultado de una consulta frente a la anterior"}
              </p>
            </div>
            <ViewToggle value={vistaSel} onChange={setVistaSel} />
          </div>
          <div className="h-72">
            {vistaSel === "area" ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillVotos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.chartGrid} vertical={false} />
                  <XAxis dataKey="name" stroke={T.chartMuted} fontSize={11} tickLine={false} axisLine={{ stroke: T.chartGrid }} />
                  <YAxis stroke={T.chartMuted} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, color: T.textPrimary }} labelStyle={{ color: T.textSecondary }} />
                  <ReferenceLine y={total.meta} stroke={COLORS.amarillo} strokeDasharray="4 4" label={{ value: "Meta", fill: COLORS.amarillo, fontSize: 10, position: "insideTopRight" }} />
                  <Area type="monotone" dataKey="votos" stroke={COLORS.blue} strokeWidth={2} fill="url(#fillVotos)" name="Votos" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <CandlestickChart votos={total.votos} meta={total.meta} height={288} />
            )}
          </div>
        </Panel>

        <Panel>
          <h3 className="text-sm font-semibold tracking-wide mb-1" style={{ color: T.textPrimary }}>MAPA DE CALOR TERRITORIAL</h3>
          <p className="text-xs mb-4" style={{ color: T.textMuted }}>{units.length} unidad(es) visibles · clic para enfocar</p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {units.map((u) => (
              <Hexagon key={u.nombre} unit={u} onSelect={onSelectUnit} isSelected={selectedNombre === u.nombre} />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-[10px]" style={{ color: T.textMuted }}>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: COLORS.verde }} /> ≥100%</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: COLORS.amarillo }} /> 50–99%</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: COLORS.rojo }} /> &lt;50%</span>
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CandlestickChartIcon size={16} className="text-blue-400 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold tracking-wide" style={{ color: T.textPrimary }}>
                RESULTADO GENERAL DE BARUTA POR ELECCIÓN
              </h3>
              <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>Suma de las {UNITS.length} unidades del municipio, sin filtro aplicado · consultas ABR 2024 – MAR 2026</p>
            </div>
          </div>
          <ViewToggle value={vistaGeneral} onChange={setVistaGeneral} />
        </div>
        <div className="h-80 mt-3">
          {vistaGeneral === "velas" ? (
            <CandlestickChart votos={grandTotal.votos} meta={grandTotal.meta} height={320} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CONSULTAS.map((c, i) => ({ name: c.label, votos: grandTotal.votos[i] }))} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillVotosGeneral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.chartGrid} vertical={false} />
                <XAxis dataKey="name" stroke={T.chartMuted} fontSize={11} tickLine={false} axisLine={{ stroke: T.chartGrid }} />
                <YAxis stroke={T.chartMuted} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, color: T.textPrimary }} labelStyle={{ color: T.textSecondary }} />
                <ReferenceLine y={grandTotal.meta} stroke={COLORS.amarillo} strokeDasharray="4 4" label={{ value: "Meta", fill: COLORS.amarillo, fontSize: 10, position: "insideTopRight" }} />
                <Area type="monotone" dataKey="votos" stroke={COLORS.cyan} strokeWidth={2} fill="url(#fillVotosGeneral)" name="Votos" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="rounded-lg p-3" style={{ border: `1px solid ${T.border}`, background: T.panelAlt }}>
            <p className="text-[10px]" style={{ color: T.textMuted }}>VOTO ACTUAL (MAR&apos;26)</p>
            <p className="font-mono text-sm mt-0.5" style={{ color: T.textPrimary }}>{fmt(grandTotal.votoActual)}</p>
          </div>
          <div className="rounded-lg p-3" style={{ border: `1px solid ${T.border}`, background: T.panelAlt }}>
            <p className="text-[10px]" style={{ color: T.textMuted }}>META TOTAL</p>
            <p className="font-mono text-sm mt-0.5" style={{ color: T.textPrimary }}>{fmt(grandTotal.meta)}</p>
          </div>
          <div className="rounded-lg p-3" style={{ border: `1px solid ${T.border}`, background: T.panelAlt }}>
            <p className="text-[10px]" style={{ color: T.textMuted }}>MEJOR RESULTADO</p>
            <p className="font-mono text-sm mt-0.5" style={{ color: COLORS.verde }}>{fmt(grandTotal.mejorVotacion)} <span style={{ color: T.textMuted }}>({grandTotal.mejorConsulta})</span></p>
          </div>
          <div className="rounded-lg p-3" style={{ border: `1px solid ${T.border}`, background: T.panelAlt }}>
            <p className="text-[10px]" style={{ color: T.textMuted }}>PEOR RESULTADO</p>
            <p className="font-mono text-sm mt-0.5" style={{ color: COLORS.rojo }}>{fmt(grandTotal.peorVotacion)} <span style={{ color: T.textMuted }}>({grandTotal.peorConsulta})</span></p>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
          <div>
            <h3 className="text-sm font-semibold tracking-wide" style={{ color: T.textPrimary }}>RANKING DE COMUNAS Y CIRCUITOS COMUNALES</h3>
            <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>
              Basado en la última consulta (MAR 2026) · {rankUniverso.length} unidad(es) evaluadas · {nComunas} comunas + {nCircuitos} circuitos comunales en el municipio
            </p>
          </div>
          <div className="flex items-center rounded-lg p-0.5 shrink-0" style={{ background: T.input, border: `1px solid ${T.border}` }}>
            {[
              { id: "todos", label: "Todos" },
              { id: "comuna", label: "Comunas" },
              { id: "circuito", label: "Circuitos" },
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => setRankScope(o.id)}
                className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide transition-all duration-200"
                style={rankScope === o.id ? { background: "rgba(59,130,246,0.15)", color: "#60A5FA" } : { color: T.textMuted }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mt-3">
          <RankedList title="Más cercanas a la meta" icon={Award} color={COLORS.verde} items={masCercanas} valueFn={(u) => fmtPct(u.pctMeta)} />
          <RankedList title="Más votadas" icon={TrendingUp} color={COLORS.blue} items={masVotadas} valueFn={(u) => fmt(u.votoActual)} />
          <RankedList title="Menos votadas" icon={TrendingDown} color={COLORS.rojo} items={menosVotadas} valueFn={(u) => fmt(u.votoActual)} />
          <RankedList title="Más lejanas de la meta" icon={ThumbsDown} color={COLORS.amarillo} items={masLejanas} valueFn={(u) => `-${fmt(u.brecha)}`} />
        </div>
      </Panel>
    </div>
  );
}

function TabComparacion({ units, total }) {
  const T = useT();
  const [unidadA, setUnidadA] = useState(UNITS[3].nombre);
  const [unidadB, setUnidadB] = useState(UNITS[16].nombre);
  const a = UNITS.find(u => u.nombre === unidadA);
  const b = UNITS.find(u => u.nombre === unidadB);
  const compareData = [
    { name: "Meta", [a.nombre]: a.meta, [b.nombre]: b.meta },
    { name: "Voto Real (MAR'26)", [a.nombre]: a.votoActual, [b.nombre]: b.votoActual },
    { name: "Mejor Votación", [a.nombre]: a.mejorVotacion, [b.nombre]: b.mejorVotacion },
  ];

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold tracking-wide" style={{ color: T.textPrimary }}>DETALLE DE LA SELECCIÓN ACTUAL</h3>
          <EstadoBadge estado={total.estado} />
        </div>
        <p className="text-xs mb-4" style={{ color: T.textMuted }}>Usa los filtros del panel superior para enfocar un Circuito, Comuna o unidad específica</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 space-y-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide" style={{ color: T.textMuted }}>Ámbito seleccionado</p>
              <p className="text-lg font-semibold" style={{ color: T.textPrimary }}>{total.nombre}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div><p className="text-[10px]" style={{ color: T.textMuted }}>VOTO ACTUAL</p><p className="font-mono" style={{ color: T.textPrimary }}>{fmt(total.votoActual)}</p></div>
              <div><p className="text-[10px]" style={{ color: T.textMuted }}>META ASIGNADA</p><p className="font-mono" style={{ color: T.textPrimary }}>{fmt(total.meta)}</p></div>
              <div><p className="text-[10px]" style={{ color: T.textMuted }}>% CUMPLIMIENTO</p><p className="font-mono" style={{ color: COLORS[total.estado] }}>{fmtPct(total.pctMeta)}</p></div>
              <div><p className="text-[10px]" style={{ color: T.textMuted }}>BRECHA PENDIENTE</p><p className="font-mono" style={{ color: T.textSecondary }}>{fmt(total.brecha)}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-lg p-2.5" style={{ border: `1px solid ${COLORS.verde}33`, background: `${COLORS.verde}0D` }}>
                <p className="text-[10px] flex items-center gap-1" style={{ color: COLORS.verde }}><TrendingUp size={11} /> MEJOR RESULTADO</p>
                <p className="font-mono text-sm mt-0.5" style={{ color: T.textPrimary }}>{fmt(total.mejorVotacion)}</p>
                <p className="text-[10px]" style={{ color: T.textMuted }}>{total.mejorConsulta}</p>
              </div>
              <div className="rounded-lg p-2.5" style={{ border: `1px solid ${COLORS.rojo}33`, background: `${COLORS.rojo}0D` }}>
                <p className="text-[10px] flex items-center gap-1" style={{ color: COLORS.rojo }}><TrendingDown size={11} /> PEOR RESULTADO</p>
                <p className="font-mono text-sm mt-0.5" style={{ color: T.textPrimary }}>{fmt(total.peorVotacion)}</p>
                <p className="text-[10px]" style={{ color: T.textMuted }}>{total.peorConsulta}</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CONSULTAS.map((c, i) => ({ name: c.label, votos: total.votos[i] }))} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.chartGrid} vertical={false} />
                <XAxis dataKey="name" stroke={T.chartMuted} fontSize={10} tickLine={false} />
                <YAxis stroke={T.chartMuted} fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, color: T.textPrimary }} />
                <ReferenceLine y={total.meta} stroke={COLORS.amarillo} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="votos" stroke="#0891B2" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p className="text-xs font-semibold mt-5 mb-1" style={{ color: T.textSecondary }}>Comparativa histórica: diferencias entre consultas consecutivas</p>
        <DeltaTable total={total} />
      </Panel>

      <Panel>
        <div className="flex items-center gap-2 mb-1">
          <GitCompare size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold tracking-wide" style={{ color: T.textPrimary }}>HERRAMIENTA DE CONFRONTACIÓN</h3>
        </div>
        <p className="text-xs mb-4" style={{ color: T.textMuted }}>Enfrenta dos unidades para comparar rendimiento político-organizativo</p>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <SelectPill value={unidadA} onChange={setUnidadA} options={UNITS.map(u => u.nombre)} />
          <span className="text-xs font-mono" style={{ color: T.textMuted }}>VS</span>
          <SelectPill value={unidadB} onChange={setUnidadB} options={UNITS.map(u => u.nombre)} />
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compareData} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.chartGrid} vertical={false} />
              <XAxis dataKey="name" stroke={T.chartMuted} fontSize={11} tickLine={false} />
              <YAxis stroke={T.chartMuted} fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, color: T.textPrimary }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey={a.nombre} fill={COLORS.blue} radius={[4, 4, 0, 0]} isAnimationActive={false} />
              <Bar dataKey={b.nombre} fill="#0891B2" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
          {[a, b].map((u) => (
            <div key={u.nombre} className="rounded-lg p-3" style={{ border: `1px solid ${T.border}` }}>
              <p className="font-semibold truncate" style={{ color: T.textPrimary }}>{u.nombre}</p>
              <p className="mt-1" style={{ color: T.textMuted }}>Cumplimiento: <span style={{ color: COLORS[u.estado] }} className="font-mono">{fmtPct(u.pctMeta)}</span></p>
              <p style={{ color: T.textMuted }}>Brecha pendiente: <span className="font-mono" style={{ color: T.textSecondary }}>{fmt(u.brecha)} votos</span></p>
              <p style={{ color: T.textMuted }}>Mejor resultado: <span className="font-mono" style={{ color: COLORS.verde }}>{fmt(u.mejorVotacion)}</span> <span style={{ color: T.textMuted }}>({u.mejorConsulta})</span></p>
              <p style={{ color: T.textMuted }}>Peor resultado: <span className="font-mono" style={{ color: COLORS.rojo }}>{fmt(u.peorVotacion)}</span> <span style={{ color: T.textMuted }}>({u.peorConsulta})</span></p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function TabMetas({ units, total }) {
  const T = useT();
  const gaugeData = [{ name: "meta", value: Math.min(100, total.pctMeta), fill: total.pctMeta >= 100 ? COLORS.verde : total.pctMeta >= 50 ? COLORS.amarillo : COLORS.rojo }];
  const rojos = units.filter(u => u.estado === "rojo").sort((a, b) => a.pctMeta - b.pctMeta);
  const verdes = units.filter(u => u.estado === "verde").sort((a, b) => b.pctMeta - a.pctMeta);
  const amarillos = units.filter(u => u.estado === "amarillo").sort((a, b) => b.pctMeta - a.pctMeta);
  const ordenadas = [...units].sort((a, b) => b.brecha - a.brecha);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Panel className="flex flex-col items-center">
          <h3 className="text-sm font-semibold tracking-wide self-start mb-1" style={{ color: T.textPrimary }}>BRECHA PENDIENTE</h3>
          <p className="text-xs self-start mb-2" style={{ color: T.textMuted }}>Meta de {total.nombre}: {fmt(total.meta)} votos</p>
          <div className="h-52 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={gaugeData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={20} background={{ fill: T.border }} isAnimationActive={false} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-mono font-bold" style={{ color: T.textPrimary }}>{fmtPct(total.pctMeta)}</span>
              <span className="text-[10px] uppercase tracking-wide" style={{ color: T.textMuted }}>Cumplimiento</span>
            </div>
          </div>
          <p className="text-xs mt-2" style={{ color: T.textSecondary }}>Brecha pendiente: <span className="font-mono text-amber-400">{fmt(total.brecha)} votos</span></p>
        </Panel>

        <Panel className="xl:col-span-2">
          <h3 className="text-sm font-semibold tracking-wide mb-4" style={{ color: T.textPrimary }}>SEMÁFORO DE CUMPLIMIENTO POR UNIDAD</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-[11px] text-emerald-400 font-semibold mb-2">✓ CUMPLIDA ({verdes.length})</p>
              <div className="space-y-1 max-h-40 overflow-auto pr-1">
                {verdes.length ? verdes.map(u => <p key={u.nombre} className="text-[11px] truncate" style={{ color: T.textSecondary }}>{u.nombre}</p>) : <p className="text-[11px]" style={{ color: T.textMuted }}>— Ninguna —</p>}
              </div>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-[11px] text-amber-400 font-semibold mb-2">◐ EN PROGRESO ({amarillos.length})</p>
              <div className="space-y-1 max-h-40 overflow-auto pr-1">
                {amarillos.length ? amarillos.map(u => <p key={u.nombre} className="text-[11px] truncate" style={{ color: T.textSecondary }}>{u.nombre} · {fmtPct(u.pctMeta)}</p>) : <p className="text-[11px]" style={{ color: T.textMuted }}>— Ninguna —</p>}
              </div>
            </div>
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
              <p className="text-[11px] text-rose-400 font-semibold mb-2">⚠ ALERTA &lt;50% ({rojos.length})</p>
              <div className="space-y-1 max-h-40 overflow-auto pr-1">
                {rojos.length ? rojos.map(u => <p key={u.nombre} className="text-[11px] truncate" style={{ color: T.textSecondary }}>{u.nombre} · {fmtPct(u.pctMeta)}</p>) : <p className="text-[11px]" style={{ color: T.textMuted }}>— Ninguna —</p>}
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <Panel>
        <h3 className="text-sm font-semibold tracking-wide mb-4" style={{ color: T.textPrimary }}>BRECHA DE VOTOS POR UNIDAD (MAR 2026)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordenadas} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.chartGrid} horizontal={false} />
              <XAxis type="number" stroke={T.chartMuted} fontSize={10} />
              <YAxis type="category" dataKey="nombre" stroke={T.chartMuted} fontSize={9} width={170} tickLine={false} />
              <Tooltip contentStyle={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, color: T.textPrimary }} />
              <Bar dataKey="brecha" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                {ordenadas.map((u) => <Cell key={u.nombre} fill={COLORS[u.estado]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}

function TablaControl({ units }) {
  const T = useT();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("pctMeta");
  const [sortDir, setSortDir] = useState("desc");

  const rows = useMemo(() => {
    let r = units.filter(u => u.nombre.toLowerCase().includes(search.toLowerCase()));
    r.sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? va - vb : vb - va;
    });
    return r;
  }, [units, search, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const Th = ({ label, k }) => (
    <th onClick={() => toggleSort(k)} className="cursor-pointer select-none px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide transition-colors" style={{ color: sortKey === k ? "#3B82F6" : T.textMuted }}>
      <span className="inline-flex items-center gap-1">{label}<ArrowUpDown size={11} /></span>
    </th>
  );

  return (
    <Panel noPadding className="overflow-hidden">
      <div className="p-5 flex flex-wrap items-center justify-between gap-3" style={{ borderBottom: `1px solid ${T.border}` }}>
        <div>
          <h3 className="text-sm font-semibold tracking-wide" style={{ color: T.textPrimary }}>TABLA DE CONTROL DE DETALLE</h3>
          <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>{rows.length} de {units.length} unidad(es) territoriales</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.textMuted }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar comuna o circuito..."
            className="rounded-lg pl-9 pr-3 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            style={{ background: T.input, border: `1px solid ${T.border}`, color: T.textPrimary }}
          />
        </div>
      </div>
      <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10" style={{ background: T.panel, borderBottom: `1px solid ${T.border}` }}>
            <tr>
              <Th label="Unidad" k="nombre" />
              <Th label="Tipo" k="tipo" />
              <Th label="Voto Real" k="votoActual" />
              <Th label="Meta" k="meta" />
              <Th label="Mejor Votación" k="mejorVotacion" />
              <Th label="Peor Votación" k="peorVotacion" />
              <Th label="% Cumplimiento" k="pctMeta" />
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: T.textMuted }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.nombre} className="transition-colors duration-150" style={{ borderBottom: `1px solid ${T.border}` }}>
                <td className="px-4 py-3 font-medium max-w-[220px] truncate" style={{ color: T.textPrimary }}>{u.nombre}</td>
                <td className="px-4 py-3 text-xs" style={{ color: T.textMuted }}>{u.tipo}</td>
                <td className="px-4 py-3 font-mono" style={{ color: T.textSecondary }}>{fmt(u.votoActual)}</td>
                <td className="px-4 py-3 font-mono" style={{ color: T.textMuted }}>{fmt(u.meta)}</td>
                <td className="px-4 py-3 font-mono" style={{ color: COLORS.verde }}>{fmt(u.mejorVotacion)}</td>
                <td className="px-4 py-3 font-mono" style={{ color: COLORS.rojo }}>{fmt(u.peorVotacion)}</td>
                <td className="px-4 py-3 font-mono font-semibold" style={{ color: COLORS[u.estado] }}>{fmtPct(u.pctMeta)}</td>
                <td className="px-4 py-3"><EstadoBadge estado={u.estado} /></td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-xs" style={{ color: T.textMuted }}>Ninguna unidad coincide con la búsqueda o el filtro activo.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ----------------------------- MESAS ELECTORALES ----------------------------- */

function ContactChip({ icon: Icon, value, href, color }) {
  const T = useT();
  if (!value) return null;
  return (
    <a
      href={href}
      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-mono truncate transition-colors duration-150 hover:brightness-125"
      style={{ background: T.input, border: `1px solid ${T.border}`, color: T.textSecondary }}
      title={value}
      onClick={(e) => { if (!href) e.preventDefault(); }}
    >
      <Icon size={11} className="shrink-0" style={{ color }} />
      <span className="truncate">{value}</span>
    </a>
  );
}

function MesaCard({ mesa }) {
  const T = useT();
  return (
    <div className="rounded-lg p-3" style={{ border: `1px solid ${T.border}`, background: T.panel }}>
      <div className="flex items-center gap-2 mb-2.5">
        <span
          className="flex items-center justify-center h-6 w-6 rounded-md text-[11px] font-mono font-bold shrink-0"
          style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA" }}
        >
          {mesa.mesa}
        </span>
        <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: T.textMuted }}>Mesa Nº {mesa.mesa}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wide mb-1 flex items-center gap-1" style={{ color: COLORS.blue }}>
            <UserCircle2 size={11} /> Presidente de Mesa
          </p>
          <p className="text-xs font-medium truncate" style={{ color: T.textPrimary }} title={mesa.nomPres}>{mesa.nomPres || "—"}</p>
          <p className="text-[10px] font-mono mb-1.5" style={{ color: T.textMuted }}>C.I. {mesa.cedPres || "—"}</p>
          <div className="flex flex-wrap gap-1.5">
            <ContactChip icon={Phone} value={mesa.telPres} href={mesa.telPres ? `tel:${mesa.telPres}` : undefined} color={COLORS.verde} />
            <ContactChip icon={Mail} value={mesa.correoPres} href={mesa.correoPres ? `mailto:${mesa.correoPres}` : undefined} color={COLORS.cyan} />
          </div>
        </div>
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wide mb-1 flex items-center gap-1" style={{ color: "#0891B2" }}>
            <UserCircle2 size={11} /> Secretario de Mesa
          </p>
          <p className="text-xs font-medium truncate" style={{ color: T.textPrimary }} title={mesa.nomSec}>{mesa.nomSec || "—"}</p>
          <p className="text-[10px] font-mono mb-1.5" style={{ color: T.textMuted }}>C.I. {mesa.cedSec || "—"}</p>
          <div className="flex flex-wrap gap-1.5">
            <ContactChip icon={Phone} value={mesa.telSec} href={mesa.telSec ? `tel:${mesa.telSec}` : undefined} color={COLORS.verde} />
            <ContactChip icon={Mail} value={mesa.correoSec} href={mesa.correoSec ? `mailto:${mesa.correoSec}` : undefined} color={COLORS.cyan} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CentroCard({ centro, isOpen, onToggle }) {
  const T = useT();
  return (
    <div className="rounded-xl overflow-hidden transition-all duration-300" style={{ border: `1px solid ${T.border}`, background: T.panelAlt }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150"
        style={{ background: isOpen ? T.hover : "transparent" }}
      >
        <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)" }}>
          <Building2 size={16} className="text-blue-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate" style={{ color: T.textPrimary }} title={centro.centro}>{centro.centro}</p>
          <p className="text-[11px] truncate mt-0.5" style={{ color: T.textMuted }} title={centro.direccion}>{centro.direccion}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ background: "rgba(34,211,238,0.1)", color: "#22D3EE" }}>
            <MapPinned size={10} /> {centro.circuito}
          </span>
          <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-mono font-semibold" style={{ background: T.input, color: T.textSecondary, border: `1px solid ${T.border}` }}>
            <Layers size={10} /> {centro.mesas.length} mesa{centro.mesas.length !== 1 ? "s" : ""}
          </span>
        </div>
        <ChevronDown size={16} className="shrink-0 transition-transform duration-300" style={{ color: T.textMuted, transform: isOpen ? "rotate(180deg)" : "none" }} />
      </button>
      <div className="sm:hidden px-4 pb-2 flex flex-wrap gap-2">
        <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ background: "rgba(34,211,238,0.1)", color: "#22D3EE" }}>
          <MapPinned size={10} /> {centro.circuito}
        </span>
        <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-mono font-semibold" style={{ background: T.input, color: T.textSecondary, border: `1px solid ${T.border}` }}>
          <Layers size={10} /> {centro.mesas.length} mesa{centro.mesas.length !== 1 ? "s" : ""}
        </span>
      </div>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 space-y-2.5" style={{ borderTop: `1px solid ${T.border}` }}>
          <div className="flex flex-wrap items-center gap-3 pt-3 pb-1 text-[10px] font-mono" style={{ color: T.textMuted }}>
            <span className="flex items-center gap-1"><Hash size={10} /> Comuna: {centro.codComuna}</span>
            <span className="flex items-center gap-1"><Hash size={10} /> Circuito: {centro.codCircuito}</span>
          </div>
          {centro.mesas.map((m) => <MesaCard key={`${centro.centro}-${m.mesa}`} mesa={m} />)}
        </div>
      )}
    </div>
  );
}

function TabMesas() {
  const T = useT();
  const [search, setSearch] = useState("");
  const [circuitoFiltro, setCircuitoFiltro] = useState("");
  const [openSet, setOpenSet] = useState(() => new Set());

  const circuitos = useMemo(() => Array.from(new Set(RAW_MESAS.map((m) => m.circuito))).sort(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CENTROS_MESA.filter((c) => {
      if (circuitoFiltro && c.circuito !== circuitoFiltro) return false;
      if (!q) return true;
      const haystack = [
        c.centro, c.direccion, c.circuito,
        ...c.mesas.flatMap((m) => [m.nomPres, m.nomSec, m.cedPres, m.cedSec, String(m.mesa)]),
      ].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [search, circuitoFiltro]);

  const totalMesas = RAW_MESAS.length;
  const totalCentros = CENTROS_MESA.length;
  const totalCircuitos = circuitos.length;

  const toggle = (nombre) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(nombre)) next.delete(nombre); else next.add(nombre);
      return next;
    });
  };
  const expandAll = () => setOpenSet(new Set(filtered.map((c) => c.centro)));
  const collapseAll = () => setOpenSet(new Set());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label="Centros de Votación" value={totalCentros} sub="Planteles y locales habilitados" icon={Building2} color={COLORS.blue} progress={100} />
        <KpiCard label="Mesas Electorales" value={totalMesas} sub="Con presidente y secretario asignado" icon={Layers} color="#0891B2" progress={100} />
        <KpiCard label="Circuitos Comunales" value={totalCircuitos} sub="Cobertura territorial del municipio" icon={MapPinned} color={COLORS.verde} progress={100} />
      </div>

      <Panel noPadding className="overflow-hidden">
        <div className="p-5 flex flex-wrap items-center gap-3" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="mr-auto">
            <h3 className="text-sm font-semibold tracking-wide flex items-center gap-2" style={{ color: T.textPrimary }}>
              <UserCheck size={16} className="text-blue-400" /> PRESIDENTES Y SECRETARIOS DE MESA
            </h3>
            <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>Consulta de julio 2026 · {filtered.length} de {totalCentros} centro(s) · {filtered.reduce((s, c) => s + c.mesas.length, 0)} mesa(s) visibles</p>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.textMuted }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar centro, mesa, nombre o cédula..."
              className="rounded-lg pl-9 pr-3 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              style={{ background: T.input, border: `1px solid ${T.border}`, color: T.textPrimary }}
            />
          </div>
          <SelectPill value={circuitoFiltro} onChange={setCircuitoFiltro} options={circuitos} placeholder="Todos los circuitos" />
          <div className="flex items-center gap-1.5">
            <button onClick={expandAll} className="text-[11px] rounded-full px-2.5 py-1.5 transition-colors" style={{ color: "#60A5FA", background: "rgba(59,130,246,0.1)" }}>Expandir todo</button>
            <button onClick={collapseAll} className="text-[11px] rounded-full px-2.5 py-1.5 transition-colors" style={{ color: T.textMuted, background: T.input, border: `1px solid ${T.border}` }}>Colapsar</button>
          </div>
        </div>

        <div className="p-5 space-y-3 max-h-[720px] overflow-y-auto">
          {filtered.length ? filtered.map((c) => (
            <CentroCard key={c.centro} centro={c} isOpen={openSet.has(c.centro)} onToggle={() => toggle(c.centro)} />
          )) : (
            <p className="text-center text-xs py-10" style={{ color: T.textMuted }}>Ningún centro coincide con la búsqueda o el filtro activo.</p>
          )}
        </div>
      </Panel>
    </div>
  );
}

/* ----------------------------- APP ----------------------------- */

const TABS = [
  { id: "general", label: "Resumen de Consulta Popular", Icon: LayoutDashboard },
  { id: "comparacion", label: "Filtros y Comparación", Icon: GitCompare },
  { id: "metas", label: "Metas y Brechas", Icon: Gauge },
  { id: "tabla", label: "Tabla de Control", Icon: TableIcon },
  { id: "mesas", label: "Presidentes y Secretarios de Mesa", Icon: UserCheck },
];
const TIPOS = ["CIRCUITO ELECTORAL", "COMUNA"];

export default function App() {
  const [tab, setTab] = useState("general");
  const [dark, setDark] = useState(true);
  const [globalTipo, setGlobalTipo] = useState("");
  const [globalUnidad, setGlobalUnidad] = useState("");
  const T = THEMES[dark ? "dark" : "light"];

  const globalUnits = useMemo(
    () => UNITS.filter(u => (!globalTipo || u.tipo === globalTipo) && (!globalUnidad || u.nombre === globalUnidad)),
    [globalTipo, globalUnidad]
  );
  const scopeLabel = globalUnidad || (globalTipo ? `TODAS: ${globalTipo}` : "MUNICIPIO BARUTA");
  const globalTotal = useMemo(() => aggregateUnits(globalUnits, scopeLabel), [globalUnits, scopeLabel]);
  const grandTotal = useMemo(() => aggregateUnits(UNITS, "MUNICIPIO BARUTA"), []);
  const hasFilter = !!(globalTipo || globalUnidad);

  const selectUnitFromMap = (u) => { setGlobalTipo(u.tipo); setGlobalUnidad(u.nombre); };
  const clearFilters = () => { setGlobalTipo(""); setGlobalUnidad(""); };

  return (
    <ThemeCtx.Provider value={T}>
      <div className="min-h-screen w-full transition-colors duration-300" style={{ background: T.bg, color: T.textPrimary, fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
          .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui; }
          .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-track { background: ${T.input}; }
          ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
          select option { background: ${T.panel}; color: ${T.textPrimary}; }
        `}</style>

        <div className="flex">
          {/* SIDEBAR */}
          <aside className="hidden md:flex flex-col w-60 shrink-0 min-h-screen p-4" style={{ background: T.sidebar, borderRight: `1px solid ${T.border}` }}>
            <div className="flex items-center gap-2 px-2 pb-6 pt-2">
              <div className="h-8 w-8 rounded-lg bg-blue-500/15 ring-1 ring-blue-500/30 flex items-center justify-center">
                <Radio size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="font-display font-bold text-sm leading-tight tracking-wide" style={{ color: T.textPrimary }}>CIE · BARUTA</p>
                <p className="text-[10px] leading-tight" style={{ color: T.textMuted }}>Centro de Inteligencia Electoral</p>
              </div>
            </div>
            <nav className="space-y-1">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300"
                  style={tab === id
                    ? { background: "rgba(59,130,246,0.12)", color: "#60A5FA", boxShadow: "inset 0 0 0 1px rgba(59,130,246,0.3)" }
                    : { color: T.textSecondary }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
            <div className="mt-auto pt-6" style={{ borderTop: `1px solid ${T.border}` }}>
              <p className="text-[10px] leading-relaxed px-2 mt-4" style={{ color: T.textMuted }}>
                Datos: consultas nacionales ABR 2024 – MAR 2026. % de cumplimiento calculado sobre la meta regional asignada por unidad.
              </p>
            </div>
          </aside>

          {/* MAIN */}
          <main className="flex-1 min-w-0">
            {/* TOP BAR */}
            <header className="sticky top-0 z-20 backdrop-blur px-5 py-4 flex flex-wrap items-center justify-between gap-3" style={{ background: T.header, borderBottom: `1px solid ${T.border}` }}>
              <div>
                <h1 className="font-display text-lg font-bold tracking-wide" style={{ color: T.textPrimary }}>{TABS.find(t => t.id === tab)?.label}</h1>
                <p className="text-xs" style={{ color: T.textMuted }}>Municipio Baruta · Consulta más reciente: MAR 2026</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDark(d => !d)}
                  className="flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300"
                  style={{ background: T.input, border: `1px solid ${T.border}` }}
                  title={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                >
                  {dark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-blue-500" />}
                </button>
                <div className="flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: T.input, border: `1px solid ${T.border}` }}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 tracking-wide">DATOS EN LÍNEA</span>
                </div>
              </div>
            </header>

            {/* GLOBAL FILTER BAR */}
            <div className="sticky top-[65px] z-10 px-5 py-3 flex flex-wrap items-center gap-3" style={{ background: T.header, borderBottom: `1px solid ${T.border}`, backdropFilter: "blur(6px)" }}>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: T.textMuted }}>
                <Filter size={12} /> Filtro global
              </span>
              <SelectPill value={globalTipo} onChange={(v) => { setGlobalTipo(v); setGlobalUnidad(""); }} options={TIPOS} placeholder="Todos los tipos" />
              <SelectPill value={globalUnidad} onChange={setGlobalUnidad} options={UNITS.filter(u => !globalTipo || u.tipo === globalTipo).map(u => u.nombre)} placeholder="Todas las unidades" />
              {hasFilter && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-[11px] rounded-full px-2.5 py-1.5 transition-colors" style={{ color: "#F87171", background: "rgba(239,68,68,0.08)" }}>
                  <X size={11} /> Limpiar filtro
                </button>
              )}
              <span className="ml-auto text-[11px] font-mono" style={{ color: T.textMuted }}>Ámbito: <span style={{ color: T.textSecondary }}>{scopeLabel}</span></span>
            </div>

            {/* MOBILE TABS */}
            <div className="md:hidden flex overflow-x-auto gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${T.border}` }}>
              {TABS.map(({ id, label, Icon }) => (
                <button key={id} onClick={() => setTab(id)} className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full text-xs transition-colors"
                  style={tab === id ? { background: "rgba(59,130,246,0.15)", color: "#60A5FA" } : { color: T.textMuted, background: T.panelAlt }}>
                  <Icon size={12} /> {label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {tab === "general" && <TabResumen units={globalUnits} total={globalTotal} grandTotal={grandTotal} onSelectUnit={selectUnitFromMap} selectedNombre={globalUnidad} />}
              {tab === "comparacion" && <TabComparacion units={globalUnits} total={globalTotal} />}
              {tab === "metas" && <TabMetas units={globalUnits} total={globalTotal} />}
              {tab === "tabla" && <TablaControl units={globalUnits} />}
              {tab === "mesas" && <TabMesas />}
            </div>
          </main>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
