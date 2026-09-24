# Genera data/examenes.json a partir de la línea base de precios (audit/before/precios-baseline.json).
# Se ejecuta una sola vez; después data/examenes.json es la fuente de verdad (se edita a mano).
import json, re, unicodedata

base = json.load(open('audit/before/precios-baseline.json', encoding='utf-8'))['examenes']

def slugify(s):
    s = unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

CAT = {  # categoría original del cotizador -> categoría del catálogo nuevo
    'Hematológicos': 'hematologia', 'Química General': 'quimica', 'Hormonas': 'hormonas',
    'Orina y Heces': 'orina-heces', 'Toxicología y Otros': 'toxicologia',
}
INFECC = {'Citomegalovirus IgG IgM','Rubeola IgG IgM','Toxoplasma IgG IgM','Dengue IgM','Herpes Virus 1 IgG IgM',
          'Herpes Virus 2 IgG IgM','Helicobacter Pylori','Clamidia IgG IgM','Mononucleosis Infecciosa','HIV',
          'Hepatitis A IgG IgM','Hepatitis B Ag','Hepatitis C','VDRL','Reacción de Widal'}

def categoria(e):
    n, c = e['nombre'], e['categoria']
    if n == 'Pruebas de Embarazo': return 'hormonas'
    if n in INFECC: return 'infecciosas'
    if c in ('Retrovirales Infecciosos', 'Seroinmunológicos'): return 'inmunologia'
    return CAT[c]

SIN = {
 'Hemograma': ['biometría hemática','BH','hemograma completo','conteo sanguíneo completo'],
 'Grupo Sanguíneo': ['tipo de sangre','grupo y factor','factor Rh','tipificación sanguínea'],
 'T. Sangría': ['tiempo de sangría'], 'T. Coagulación': ['tiempo de coagulación'],
 'TP': ['tiempo de protrombina'], 'TPT': ['tiempo parcial de tromboplastina','TTP','TTPa'],
 'Colesterol': ['colesterol total'], 'HDL': ['colesterol HDL','colesterol bueno'], 'LDL': ['colesterol LDL','colesterol malo'],
 'Triglicéridos': ['trigliceridos'], 'Glucosa': ['glucemia','glicemia','azúcar en sangre','glucosa en ayunas'],
 'Hemoglobina Glicosilada': ['HbA1c','A1c','hemoglobina glucosilada'], 'Urea': ['nitrógeno ureico','BUN'],
 'Ácido Úrico': ['acido urico'], 'Proteínas': ['proteínas totales'], 'Bilirrubinas': ['bilirrubina total'],
 'B. Indirecta': ['bilirrubina indirecta'], 'B. Directa': ['bilirrubina directa'], 'TGO': ['AST','transaminasa oxalacética'],
 'TGP': ['ALT','transaminasa pirúvica'], 'F. Alcalina': ['fosfatasa alcalina'], 'F. Ácida': ['fosfatasa ácida'],
 'F. Ácida Prostática': ['fosfatasa ácida prostática'], 'DHL': ['LDH','lactato deshidrogenasa'], 'GGT': ['gamma glutamil transferasa'],
 'Sodio': ['electrolitos','Na'], 'Potasio': ['electrolitos','K'], 'Cloro': ['electrolitos','cloruro'],
 'Saturación': ['saturación de transferrina'], 'CPK': ['CK','creatina quinasa','creatinfosfoquinasa'],
 'BHCG Cuantitativa': ['beta HCG','prueba de embarazo en sangre','HCG cuantitativa','embarazo'],
 'Foliculoestimulante': ['FSH','hormona foliculoestimulante'], 'Luteinizante': ['LH','hormona luteinizante'],
 'Estradiol': ['E2','estrógeno'], 'TSH': ['tirotropina','tiroides'], 'T3 Libre': ['FT3','tiroides'], 'T4 Libre': ['FT4','tiroides'],
 'ACTH': ['corticotropina'], 'Citomegalovirus IgG IgM': ['CMV','TORCH'], 'Rubeola IgG IgM': ['rubéola','TORCH'],
 'Toxoplasma IgG IgM': ['toxoplasmosis','TORCH'], 'Dengue IgM': ['dengue'], 'Herpes Virus 1 IgG IgM': ['herpes simple 1','HSV-1','TORCH'],
 'Herpes Virus 2 IgG IgM': ['herpes simple 2','HSV-2','TORCH'], 'Helicobacter Pylori': ['H. pylori en sangre','helicobacter'],
 'Clamidia IgG IgM': ['chlamydia','clamidia'], 'Mononucleosis Infecciosa': ['mononucleosis'], 'HIV': ['VIH','prueba de VIH'],
 'Hepatitis A IgG IgM': ['hepatitis A'], 'Hepatitis B Ag': ['hepatitis B','antígeno de hepatitis B'], 'Hepatitis C': ['hepatitis C'],
 'PSA Total': ['antígeno prostático','próstata'], 'PSA Libre': ['antígeno prostático libre','próstata'],
 'FR Semicuantitativo': ['factor reumatoideo'], 'ASTO Semicuantitativo': ['antiestreptolisina O'],
 'PCR Semicuantitativo': ['proteína C reactiva','inflamación'], 'VDRL': ['sífilis'], 'Pruebas de Embarazo': ['prueba de embarazo','embarazo','HCG'],
 'Reacción de Widal': ['tifoidea','fiebre tifoidea'], 'Inmunoglobulina A': ['IgA'], 'Inmunoglobulina M': ['IgM'],
 'Inmunoglobulina E': ['IgE','alergia'], 'Inmunoglobulina G': ['IgG'],
 'EMO': ['elemental y microscópico de orina','examen de orina','uroanálisis','orina'], 'Microalbuminuria': ['microalbúmina en orina'],
 'Parasitario (Heces)': ['coproparasitario','examen de heces','parásitos','copro'], 'Sangre Oculta': ['sangre oculta en heces'],
 'Helicobacter Pylori (Heces)': ['H. pylori en heces','antígeno de helicobacter'], 'PH en Heces': ['pH fecal'],
 'Panel Toxicológico 6 Determinaciones': ['prueba de drogas','toxicológico','antidoping','drogas en orina'],
 'Cultivos Varios': ['cultivo','urocultivo','coprocultivo'],
}

PREP = {
 'ayuno': 'Generalmente se indica ayuno de 8 a 12 horas (puedes tomar agua). Confirma la preparación con nosotros.',
 'sin-ayuno': 'Por lo general no requiere ayuno. Si lo harás junto con otros exámenes de sangre, confirma con nosotros la preparación.',
 'ciclo': 'El momento de la toma puede depender del día del ciclo menstrual; sigue la indicación de tu médico.',
 'manana': 'Suele tomarse en la mañana; confirma con tu médico o con nosotros la hora indicada.',
 'orina': 'Primera orina de la mañana, tomando el chorro medio en un frasco estéril.',
 'heces': 'Muestra de heces reciente en un frasco limpio, sin mezclar con orina.',
 'coagulacion': 'Por lo general no requiere ayuno. Avísanos si tomas anticoagulantes u otros medicamentos.',
 'tox': 'Muestra de orina. Avísanos si tomas algún medicamento.',
 'consultar': 'La preparación depende del tipo de muestra; consúltala con nosotros antes de venir.',
}
def prep(e):
    n, c = e['nombre'], categoria(e)
    if n in ('Colesterol','HDL','LDL','Triglicéridos','Glucosa','Insulina','Hierro','Transferrina','Saturación'): return PREP['ayuno']
    if n in ('Foliculoestimulante','Luteinizante','Progesterona','Estradiol'): return PREP['ciclo']
    if n in ('Cortisol','ACTH','Testosterona'): return PREP['manana']
    if n in ('TP','TPT','T. Sangría','T. Coagulación','Fibrinógeno','Plaquetas'): return PREP['coagulacion']
    if n == 'EMO' or n == 'Microalbuminuria': return PREP['orina']
    if n.startswith('Panel Toxicológico'): return PREP['tox']
    if n == 'Cultivos Varios': return PREP['consultar']
    if c == 'orina-heces': return PREP['heces']
    if c == 'quimica': return PREP['ayuno']
    return PREP['sin-ayuno']

# Páginas de examen -> exámenes del catálogo que cubren (por nombre exacto)
PAGINAS = {
 'biometria-hematica': ['Hemograma'], 'glucosa': ['Glucosa'],
 'perfil-lipidico': ['Colesterol','HDL','LDL','Triglicéridos'], 'hemoglobina-glicosilada': ['Hemoglobina Glicosilada'],
 'perfil-tiroideo': ['TSH','T3 Libre','T4 Libre'], 'prueba-de-embarazo-en-sangre': ['BHCG Cuantitativa','Pruebas de Embarazo'],
 'examen-de-orina-emo': ['EMO'], 'coproparasitario': ['Parasitario (Heces)'],
 'perfil-renal': ['Urea','Creatinina','Ácido Úrico'], 'perfil-hepatico': ['TGO','TGP','Bilirrubinas','F. Alcalina','GGT'],
 'psa': ['PSA Total','PSA Libre'], 'prueba-vih': ['HIV'], 'hepatitis-b-y-c': ['Hepatitis B Ag','Hepatitis C'],
 'vdrl-sifilis': ['VDRL'], 'helicobacter-pylori': ['Helicobacter Pylori','Helicobacter Pylori (Heces)'], 'dengue': ['Dengue IgM'],
 'ferritina-y-hierro': ['Ferritina','Hierro'], 'panel-toxicologico': ['Panel Toxicológico 6 Determinaciones'],
 'hormonas-femeninas': ['Foliculoestimulante','Luteinizante','Estradiol','Progesterona','Prolactina'],
 'testosterona': ['Testosterona'], 'insulina': ['Insulina'], 'cortisol': ['Cortisol'], 'grupo-sanguineo': ['Grupo Sanguíneo'],
 'tiempos-de-coagulacion': ['TP','TPT'],
 'torch': ['Toxoplasma IgG IgM','Rubeola IgG IgM','Citomegalovirus IgG IgM','Herpes Virus 1 IgG IgM','Herpes Virus 2 IgG IgM'],
}
pagina_de = {n: p for p, ns in PAGINAS.items() for n in ns}
grupo = {n: ns for ns in PAGINAS.values() for n in ns}
EXTRA_REL = {
 'Hierro': ['Transferrina','Saturación','Ferritina'], 'Transferrina': ['Hierro','Saturación','Ferritina'],
 'Saturación': ['Hierro','Transferrina','Ferritina'], 'Ferritina': ['Hierro','Transferrina','Saturación'],
 'Bilirrubinas': ['B. Directa','B. Indirecta','TGO'], 'B. Directa': ['Bilirrubinas','B. Indirecta'], 'B. Indirecta': ['Bilirrubinas','B. Directa'],
 'Proteínas': ['Albúmina','Globulina'], 'Albúmina': ['Proteínas','Globulina'], 'Globulina': ['Proteínas','Albúmina'],
 'Sodio': ['Potasio','Cloro'], 'Potasio': ['Sodio','Cloro'], 'Cloro': ['Sodio','Potasio'],
 'Calcio': ['Fósforo','Magnesio'], 'Fósforo': ['Calcio','Magnesio'], 'Magnesio': ['Calcio','Fósforo'],
 'Amilasa': ['Lipasa'], 'Lipasa': ['Amilasa'], 'Glucosa': ['Hemoglobina Glicosilada','Insulina'],
 'Hemoglobina Glicosilada': ['Glucosa','Insulina'], 'Insulina': ['Glucosa','Hemoglobina Glicosilada'],
 'Hemograma': ['Plaquetas','Reticulocitos','Ferritina'], 'Plaquetas': ['Hemograma','TP','TPT'],
 'T. Sangría': ['T. Coagulación','TP','TPT'], 'T. Coagulación': ['T. Sangría','TP','TPT'], 'Fibrinógeno': ['TP','TPT'],
 'Sangre Oculta': ['Parasitario (Heces)','Helicobacter Pylori (Heces)'], 'Rotavirus': ['Adenovirus','Parasitario (Heces)'],
 'Adenovirus': ['Rotavirus','Parasitario (Heces)'], 'EMO': ['Microalbuminuria','Creatinina'], 'Microalbuminuria': ['EMO','Creatinina'],
 'Parasitario (Heces)': ['Sangre Oculta','Polimorfonucleares','PH en Heces'],
}
slug_de = {e['nombre']: slugify(e['nombre']) for e in base}
assert len(set(slug_de.values())) == 97
out = []
for e in base:
    n = e['nombre']
    rel = [x for x in grupo.get(n, []) if x != n] or EXTRA_REL.get(n, [])
    for x in EXTRA_REL.get(n, []):
        if x not in rel and x != n: rel.append(x)
    out.append({
        'slug': slug_de[n], 'nombre': n, 'sinonimos': SIN.get(n, []), 'categoria': categoria(e),
        'precio': e['precio'], 'tienePagina': n in pagina_de, 'pagina': pagina_de.get(n),
        'preparacion': prep(e), 'relacionados': [slug_de[x] for x in rel[:3]],
    })
cats = [
 {'slug':'hematologia','nombre':'Hematología y coagulación'}, {'slug':'quimica','nombre':'Química sanguínea'},
 {'slug':'hormonas','nombre':'Hormonas'}, {'slug':'infecciosas','nombre':'Infecciosas y serología'},
 {'slug':'inmunologia','nombre':'Inmunología y marcadores'}, {'slug':'orina-heces','nombre':'Orina y heces'},
 {'slug':'toxicologia','nombre':'Toxicología y cultivos'},
]
json.dump({'moneda':'USD','nota':'Precios referenciales publicados en acculab.bio/cotizar. Fuente de verdad del sitio: no editar precios sin confirmación del laboratorio.',
           'categorias':cats,'examenes':out}, open('data/examenes.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
print(len(out), sum(1 for x in out if x['tienePagina']))
