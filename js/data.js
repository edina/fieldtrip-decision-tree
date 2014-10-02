var data = [
    {
        "id": "root",
        "parent": null,
        "name": "Is it ",
        "children": [['Primarly vegetated', '1.0.0'], ['Primarly non-vegetated', '2.0.0']]
    },
    {
        "id": "Base Class I",
        "parent": "root",
        "name": "Is it mostly",
        "children": ["green", "brown", "burnt"]
    },
    {
        "id": "1.0.0",
        "parent": "root",
        "name": "Is it ",
        "children": [["terrestrial", "1.1.0"], ["aquatic/regularly flooded", "1.2.0"]]
    },
    {
        "id": "1.1.0",
        "parent": "1.0.0",
        "name": "Is it ",
        "children": [["cultivated/managed (Primarily vegetated, terrestrial cultivated/managed)", "1.1.1"], ["natural/semi-natural (Primarily vegetated, terrestrial natural/semi-natural)", "1.1.2"]]
    },
    {
        "id": "1.2.0",
        "parent": "1.0.0",
        "name": "Is it ",
        "children": [["Is it cultivated/managed (Primarily vegetated, aquatic/regularly flooded, cultivated/managed)", "1.2.1"], ["Is it natural/semi-natural (Primarily vegetated, aquatic/regularly flooded, natural/semi-natural)", "1.2.2"]]
    },
    {
        "id": "PV",
        "parent": "1.0.0",
        "name": "Is it primarly ",
        "children": [["Trees", "PV1"],["Bushes,shrubs", "PV2"],["Herbaceous plants(grasses and forbs)", "PV3"],["Succulents", "PV4"],["Lichens", "PV5"],["Mosses", "PV6"]]
    },
    {
        "id": "PV.1",
        "parent": "1.0.0",
        "name": "Is it ",
        "children": [["Broadleaved", "PV1.1"], ["Coniferous", "PV1.2"], ["Palm Trees", "PV1.3"]]
    },
    {
        "id": "PV.2",
        "parent": "1.0.0",
        "name": "Name the leaf character",
        "children": [["Sclerophyte", "PV"], ["Regular", ""]]
    },
    {
        "id": "PV.3",
        "parent": "1.0.0",
        "name": "Describe the phenology",
        "children": [["Annual", ""], ["Multiannual", ""], ["Permanent", ""], ["Evergreen", ""], ["Deciduous", ""]]
    },
    {
        "id": "PV.4",
        "parent": "1.0.0",
        "name": "What is the crown cover density (%)?",
        "children": "integer"
    },
    {
        "id": "PV.5",
        "parent": "1.0.0",
        "name": "What is the vegetation height (m)?",
        "children": "integer"
    },
    {
        "id": "PV2",
        "parent": "PV",
        "name": "Is it ",
        "children": [["Regular bushes", "PV2.1"], ["Dward Shrubs", "PV2.2"]]
    },
    {
        "id": "PV3",
        "parent": "PV",
        "name": "Is it ",
        "children": [["Regular graminaceous", "PV1.1"], ["Reeds", "PV1.2"], ["Forbs, ferns", "PV3.3"]]
    },
    {
        "id": "PV.6",
        "parent": "1.0.0",
        "name": "Is there a second layer of vegetation?",
        "children": [["yes, but I don’t want to add more info on it", "PV"], ["no", null], ["yes and I will provide more info on that now", null]]
    },
    {
        "id": "1.1.1_1.2.1_1",
        "parent": ["1.1.1", "1.2.1"],
        "name": "What is the agricultural type?",
        "children": [["Arable cropland", "1.1.1_1.2.1_1.1"], ["Permanent cropland", "1.1.1_1.2.1_1.2"], ["Permanent grassland", "1.1.1_1.2.1_1.3"]]
    },
    {
        "id": "1.1.1_1.2.1_2",
        "parent": ["1.1.1", "1.2.1"],
        "name": "What is the cultivation pattern?",
        "children": [["Crop rotation", "1.1.1_1.2.1_2.1"], ["No crop rotation", "1.1.1_1.2.1_2.2"], ["Plantation", "1.1.1_1.2.1_2.3"], ["Extensive orchards", "1.1.1_1.2.1_2.4"], ["Agroforestry", "1.1.1_1.2.1_2.5"], ["Shifting cultivation (slash and burn)", "1.1.1_1.2.1_2.6"]]
    },
    {
        "id": "1.1.1_1.2.1_3",
        "parent": ["1.1.1", "1.2.1"],
        "name": "Is there fertilizing?",
        "children": [["Yes", "1.1.1_1.2.1_3.1"], ["No", "1.1.1_1.2.1_3.2"], ["Not sure", "1.1.1_1.2.1_3.3"]]
    },
    {
        "id": "1.1.1_1.2.1_4",
        "parent": ["1.1.1", "1.2.1"],
        "name": "Is there irrigation?",
        "children": [["Yes", "1.1.1_1.2.1_4.1"], ["No", "1.1.1_1.2.1_4.2"], ["Not sure", "1.1.1_1.2.1_4.3"]]
    },
    {
        "id": "1.1.1_1.2.1_5",
        "parent": ["1.1.1", "1.2.1"],
        "name": "Is there mowing?",
        "children": [["Yes", "1.1.1_1.2.1_5.1"], ["No", "1.1.1_1.2.1_5.2"], ["Not sure", "1.1.1_1.2.1_5.3"]]
    },
    {
        "id": "1.1.1_1.2.1_6",
        "parent": ["1.1.1", "1.2.1"],
        "name": "Is there grazing?",
        "children": [["Yes", "1.1.1_1.2.1_6.1"], ["No", "1.1.1_1.2.1_6.2"], ["Not sure", "1.1.1_1.2.1_6.3"]]
    },
    {
        "id": "1.1.1_1.2.1_7",
        "parent": ["1.1.1", "1.2.1"],
        "name": "Is there drainage?",
        "children": [["Yes", "1.1.1_1.2.1_7.1"], ["No", "1.1.1_1.2.1_7.2"], ["Not sure", "1.1.1_1.2.1_7.3"]]
    },
    {
        "id": "1.1.1_1.2.1_8",
        "parent": ["1.1.1_1.2.1_6", "1.1.1_1.2.1_7"],
        "name": "Is it intense?",
        "children": [["Yes", "1.1.1_1.2.1_8.1"], ["No", "1.1.1_1.2.1_8.2"], ["Not sure", "1.1.1_1.2.1_8.3"]]
    },
    {
        "id": "1.1.1_1.2.1_9",
        "parent": ["1.1.1", "1.2.1"],
        "name": "Is there drainage?",
        "children": [["Yes", "1.1.1_1.2.1_9.1"], ["No", "1.1.1_1.2.1_9.2"], ["Not sure", "1.1.1_1.2.1_9.3"]]
    },
    {
        "id": "1.1.1_1.2.1_10",
        "parent": ["1.1.1", "1.2.1"],
        "name": "Is the land managed as a forest?",
        "children": [["Yes", "1.1.1_1.2.1_10.1"], ["No", "1.1.1_1.2.1_10.2"], ["Not sure", "1.1.1_1.2.1_10.3"], ["Other", "1.1.1_1.2.1_10.4"]]
    },
    {
        "id": "1.1.1_1.2.1_10.1",
        "parent": "1.1.1_1.2.1_10",
        "name": "Is it managed for wood production?",
        "children": [["Yes", "1.1.1_1.2.1_10.1.1"], ["No", "1.1.1_1.2.1_10.1.2"], ["Not sure", "1.1.1_1.2.1_10.1.3"]]
    },
    {
        "id": "1.1.1_1.2.1_10.1.1",
        "parent": "1.1.1_1.2.1_10.1",
        "name": "Is it ",
        "children": [["Is it a plantation (i.e. plantation, monoculture, large clearcuts, strong soil preparation, short cycles)", "1.1.1_1.2.1_10.1.1.1"], ["Is it regular forestry with clearcuts possible?", "1.1.1_1.2.1_10.1.1.2"]]
    },
    {
        "id": "1.1.1_1.2.1_10.2",
        "parent": "1.1.1_1.2.1_10",
        "name": "Is it multifunctional?",
        "children": [["Yes", "1.1.1_1.2.1_10.2.1"], ["No", "1.1.1_1.2.1_10.2.2"], ["Not sure", "1.1.1_1.2.1_10.2.3"]]
    },
    {
        "id": "1.1.1_1.2.1_11",
        "parent": ["1.1.1", "1.2.1"],
        "name": "Is the land managed as cropland? ",
        "children": [["Yes", "1.1.1_1.2.1_11.1"], ["No", "1.1.1_1.2.1_11.2"], ["Not sure", "1.1.1_1.2.1_11.3"]]
    },
    {
        "id": "1.1.1_1.2.1_11.1",
        "parent": "1.1.1_1.2.1_11",
        "name": "Is it for ",
        "children": [["arable crops? (e.g. cereal, rice, root crops, leguminous, oil crops, vegetables, cotton, hop, asparagus, strawberries, flowers)", "1.1.1_1.2.1_11.1.1"], ["permanent crops? (e.g. vineyards, fruit/berries/nuts, olive trees, nursery/Christmas trees, coffee/tea/cacao, banana, willow)", "1.1.1_1.2.1_11.1.2"]]
    },
    {
        "id": "1.1.1_1.2.1_12",
        "parent": ["1.1.1", "1.2.1"],
        "name": "Is it pasture/meadow?",
        "children": [["Yes", "1.1.1_1.2.1_12.1"], ["No", "1.1.1_1.2.1_12.2"], ["Not sure", "1.1.1_1.2.1_12.3"], ["Other", "1.1.1_1.2.1_12.4"]]
    },
    {
        "id": "1.1.1_1.2.1_13",
        "parent": ["1.1.1", "1.2.1"],
        "name": "What is the approx. field size?",
        "children": "integer"
    },
    {
        "id": "1.2.1.1",
        "parent": "1.2.1",
        "name": "Water regime:",
        "children": [["Is it waterlogged?", "1.2.1.1.1"], ["Is it wet periodically/seasonally?", "1.2.1.1.2"], ["Is it episodic i.e. dry for several months?", "1.2.1.1.3"]]
    },
    {
        "id": "1.2.1.2",
        "parent": "1.2.1",
        "name": "Wetness:",
        "children": [["Is there surface water?", "1.2.1.2.1"], ["Is there saturated ground?", "1.2.1.2.2"]]
    },
    {
        "id": "1.2.1.3",
        "parent": "1.2.1",
        "name": "Salinity",
        "children": [["Is the water saline?", "1.2.1.3.1"], ["Is the water brackish?", "1.2.1.3.2"], ["Is the water fresh?", "1.2.1.3.3"]]
    },
    {
        "id": "1.2.1.4",
        "parent": "1.2.1",
        "name": "Is there a tidal influence?",
        "children": [["Yes", "1.2.1.4.1"], ["No", "1.2.1.3.2"], ["Not Sure", "1.2.1.4.1"]]
    },
    {
        "id": "2.0.0",
        "parent": "root",
        "name": "Is it ",
        "children": [["terrestrial", "2.1.0"], ["aquatic/regularly flooded", "2.2.0"]]
    },
    {
        "id": "2.1.0",
        "parent": "2.0.0",
        "name": "Is it ",
        "children": [["artificial surfaces and constructions (primarily non-vegetated, terrestrial, artificial surfaces and constructions)", "2.1.1"], ["bare areas/natural material surface (primarily non-vegetated, terrestrial, bare areas/natural material surfaces)", "2.1.2"]]
    },
    {
        "id": "2.2.0",
        "parent": "2.0.0",
        "name": "Is it ",
        "children": [["artificial waterbodies, snow, ice (primarily non-vegetated, aquatic/regularly flooded, artificial waterbodies, snow, ice)", "2.2.1"], ["natural waterbodies, snow, ice (primarily non-vegetated, aquatic/regularly flooded, natural waterbodies, snow, ice)", "2.2.2"]]
    },
    {
        "id": "2.1.1",
        "parent": "2.1",
        "name": "Is it ",
        "children": [["Sealed", "AS-C1"], ["Non-sealed", "AS-C2"]]
    },
    {
        "id": "AS-C1",
        "parent": "2.1.1",
        "name": "Is it ",
        "children": [["Buildings", "AS-C1.1"], ["Other constructions", "AS-C1.2"]]
    },
    {
        "id": "AS-C1.1",
        "parent": "AS-C1",
        "name": "Bildings:",
        "children": [["Are they, Conventional buildings (e.g. houses, blocks of flats, city street blocks, stores) ", "AS-C1.1.1"], ["Specific buildings (e.g. stadiums, churches, towers, greenhouse)", "AS-C2.1.2"]]
    },
    {
        "id": "AS-C2",
        "parent": "2.1.1",
        "name": "",
        "children": [["Is it Waste materials (e.g. communal / industrial/ waste)", "AS-C2.1"], ["Other artificial surface (e.g. nat. mat. displaced from original origin, artificially consolidated, e.g. logistic and storage areas, festive squares, unvegetated sport fields, railway tracks)", "AS-C2.2"]]
    },
    {
        "id": "2.1.2",
        "parent": "2.1",
        "name": "Is it ",
        "children": [["Consolidated?", "BNM1"], ["Un-consolidated", "BNM2"]]
    },
    {
        "id": "BNM1",
        "parent": "2.1.2",
        "name": "Is it ",
        "children": [["Bare rock?", "BNM1.1"], ["Hard-pan?", "BNM1.2"]]
    },
    {
        "id": "BNM2",
        "parent": "2.1.2",
        "name": "Is it ",
        "children": [["Mineral fragments?", "BNM2.1"], ["Bare soils", "BNM2.2"], ["Natural deposits", "BNM2.3"]]
    },
    {
        "id": "BNM2.1",
        "parent": "BNM2",
        "name": "Is it ",
        "children": [["Boulders, stones?", "BNM2.1.1"], ["Pebbles, gravel?", "BNM2.1.2"], ["Sand, grit?", "BNM2.1.3"], ["Clay, silt?", "BNM2.1.4"], ["Mixed, unsorted material?", "BNM2.1.5"]]
    },
    {
        "id": "BNM2.3",
        "parent": "BNM2",
        "name": "Is it ",
        "children": [["inorganic deposits?", "BNM2.3.1"], ["organic deposits?", "BNM2.3.2"]]
    },
    {
        "id": "2.2.1",
        "parent": "2.2",
        "name": "Is it ",
        "children": [["watersource?", "2.2.1.1"], ["waterbody?", "2.2.1.2"], ["lagoon?", "2.2.1.3"], ["other?", "2.2.1.4"]]
    },
    {
        "id": "2.2.2",
        "parent": "2.2",
        "name": "Is it ",
        "children": [["watersource?", "2.2.2.1"], ["waterbody?", "2.2.2.2"], ["estuary?", "2.2.2.3"], ["lagoon?", "2.2.2.3"], ["open sea?", "2.2.2.4"], ["permanent snow?", "2.2.2.5"], ["ice/glacier?", "2.2.2.6"]]
    }
]