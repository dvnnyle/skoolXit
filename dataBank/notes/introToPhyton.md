# **Introduksjon-Phyton**

## 

**1\. Phyton: Hva er programmering?**

Programmering er å **gi datamaskiner instrukser** slik at de kan gjøre oppgaver for oss. Vi skriver kode som datamaskinen følger steg for steg.

**1.1 Programmering of algoritmer**  
Programmering er å gi datamaskiner instrukser slik at de kan gjøre oppgaver for oss. Vi skriver kode som datamaskinen følger steg for steg.  

**1.2 Programmeringsspråk**

En **algoritme** er en **oppskrift** eller en plan for hvordan et problem skal løses.

Programmering er å **skrive algoritmen i et språk** som datamaskinen forstår.

- **1.2.1 Python  
    **Python er et enkelt og populært programmeringsspråk fordi det er lett å lære, lett å lese, passer både for nybegynnere og eksperter, og brukes i alt fra spill og nettsider til roboter, kunstig intelligens og dataanalyse.

## **2 Phyton: Objektorientert programmering**

Objektorientert programmering (OOP) handler om å organisere kode i **objekter** - små "byggesteiner" som har **egenskaper** (data) og **funksjoner** (handlinger). Dette gjør koden enklere å forstå og bruke om igjen.

**2.1 Hullkort og assembly-språk**

I starten av datamaskinens historie brukte man hullkort og assemblerspråk, som var veldig enkle og nær maskinkoden. Programmet var tungvint og teknisk, og man måtte gi instruksjoner på et svært lavt nivå.

**2.2 Moderne språk**

Senere kom moderne programmeringsspråk, som er mye enklere å lese og skrive. De ligner mer på vanlig språk og gjør det raskere å lage programmer.

**2.3 Simula 67, objektorientert programmering**

Simula 67, utviklet i Norge, var det første språket som introduserte objektorientert programmering. Dette la grunnlaget for språk som Python, Java og C#, som alle bruker OOP i dag.

# **Grunnleggende programmering**

## **4 Utsagn, variabler og datatyper**

Et **utsagn** er en enkelt linje kode som utfører en handling, for eksempel å skrive noe på skjermen eller endre en verdi.

**4.1.1 Utsagn**

Et **utsagn** er en enkelt linje kode som utfører en handling, for eksempel å skrive noe på skjermen eller endre en verdi.

**4.2 Rekkelølge**

Kode kjøres **ovenfra og ned**, linje for linje, i den rekkefølgen du skriver den.

- **4.2.1 Variabler**  
    En **variabel** er et navn som lagrer en verdi, som et lite datasett du kan bruke senere.
- **4.2.2 Deklarasjon og tilordning**  
    Å **deklarere** betyr å lage variabelen, og **tilordning** betyr å gi den en verdi.  
    Eksempel: alder = 15|| navn = "kevin"
- **4.2.3 Endre verdi på variabel**  
    Du kan når som helst sette en ny verdi:  
    Eksempel: alder = 16

**4.3 Datatyper  
**Datatyper beskriver hva slags type data en variabel lagrer.

- **4.3.1 Tekst**  
    Tekst (string) brukes for ord og setninger:  
    Eksempel: navn = "kevinn"
- **4.3.2 Heltall og desimaltall**
  - **Heltall (int)**: 1, 5, 20
  - **Desimaltall (float)**: 3.14, 2.5  

- **4.3.3 Sannhetsverdi**  
    En sannhetsverdi (bool) er enten: #true eller #false

## **5 Beslutninger**

**5.1 Output og input**

- **Output** betyr å vise noe på skjermen, f.eks. med print().
- **Inpu**t betyr at brukeren skriver inn noe, som du henter med input().
- **5.1.1 Typecasting**  
    Typecasting betyr å gjøre om en verdi til en annen datatype, f.eks.
  - int("5") - gjør tekst til heltall
  - float("3.14") - gjør tekst til desimaltall

**5.2 Beslutninger  
**Beslutninger lar programmet velge hva som skal skje, basert på betingelser.

- **5.2.1 Logiske operasjoner.  
    **Logiske operasjoner brukes for å sammenligne verdier:
- \== (lik)
- != (ikke lik)
- \> og < (større/mindre enn)
- and, or, not  

- **5.2.2 If-setninger\*  
    **if brukes for å sjekke en betingelse. Hvis den er sann, kjører koden:

**if alder >= 18:  
print("Du er voksen")**

- **5.2.3 Elif og Else  
    **Elif (= "ellers hvis") gir flere valg, og Else brukes når ingen betingelser stemmer:

**if alder >= 18:**

**print("Voksen")**

**elif alder > 12:**

**print("Tenåring")**

**else:**

**print("Barn")**

## **6 Uttrykk og feilmeldinger**

**6.1 Evaluering av uttrykk  
**Evaluering betyr at Python regner ut eller tolker et uttrykk for eksempel:  
3 + 5 # blir 8  
alder > 10 # blir True eller False

- **6.1.1 Tilordning  
    **Tilordning betyr å gi en variabel en verdi.  
    Python bruker = til dette:  
    x = 10 eller navn = "Anna"

Her evaluerer Python høyresiden først, og lagrer resultatet i variabelen på venstre side.

- **6.1.2 Kall i funksjon  
    **Et funksjonskall betyr å bruke en funksjon.  
    Python kjører koden inni funksjonen og gir et resultat tilbake.  
    <br/>print("Hei") # kaller print-funksjonen  
    tall = int("5") # kaller int(), gjør tekst om til tall

**6.2 Fell og feilmeldinger** .

- 6.2.1 Syntakes og Kjørtidsfeil
- 6.2.2 Logiske feil
- 6.2.3 Å lese en feilmelding

## **7 Prosedyrer, funksjoner og skop**

**7.1 Prosedyrer  
**En prosedyre er en del av koden som utfører en oppgave, men som ikke returnerer en verdi.

I Python tilsvarer dette funksjoner uten return.

- **7.1.2 Prosedyre uten parameter  
    **En prosedyre uten parametere tar ingen innverdier:  
    def hils():  
    print("Hei!")
- **7.1.3 Prosedyrer med parametere  
    **En prosedyre med parametere tar inn informasjon slik at den kan tilpasses:  
    def hils(navn):

print("Hei,", navn)

**7.2 Funksjoner  
**En funksjon ligner på en prosedyre, men returnerer en verdi:  
def pluss(a, b):

return a + b  
Funksjoner brukes når du trenger et resultat tilbake.

**7.3 Variabler og skop  
**Skop (scope) handler om hvor i programmet en variabel er tilgjengelig.

- Lokal variabel: finnes bare inne i en funksjon  

- Global variabel: kan brukes i hele programmet  
    <br/>x = 10 # global  
    def test():

y = 5 # lokal

## **8 Samlinger**

## **8.1 Lister**

- Lister er samlinger av flere verdier i én variabel.

### **8.1.1 Opprette lister, legge til og fjerne elementer**

- Opprette liste:
- frukt = \["eple", "banan", "pære"\]
- Legge til:
- frukt.append("appelsin")
- Fjerne:
- frukt.remove("banan")

### **8.2.2 Indeksering av lister**

- Indeksering betyr å hente et element ved hjelp av posisjonen:
- frukt\[0\] # første element

## **8.2 Ordbøker**

- Ordbøker lagrer data som **nøkkel : verdi**.

### **8.2.1 Opprette ordbøker, legge til og fjerne elementer**

- Opprette:
- person = {"navn": "Sara", "alder": 15}
- Legge til:
- person\["hobby"\] = "fotball"
- Fjerne:
- del person\["alder"\]

### **8.2.2 Indeksering av ordbøker**

- Du henter verdier med nøkkelen:
- person\["navn"\]

## **8.3 Nøstede datastrukturer**

- Nøstede datastrukturer betyr at en datastruktur inneholder en annen.

### **8.3.1 Nøstede lister**

- matrise = \[\[1, 2\], \[3, 4\]\]

### **8.3.2 Nøstede ordbøker**

- bruker = {
- "navn": "Jon",
- "adresse": {"gate": "Parkveien", "nummer": 12}
- }

### **8.3.3 Andre nøstede datastrukturer**

- Du kan kombinere lister og ordbøker på mange måter, f.eks.:
- klasse = \[
- {"navn": "Emma", "alder": 14},
- {"navn": "Leo", "alder": 15}
- \]