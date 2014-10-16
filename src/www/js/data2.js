/*
Copyright (c) 2014, EDINA.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this
   list of conditions and the following disclaimer in the documentation and/or
   other materials provided with the distribution.
3. All advertising materials mentioning features or use of this software must
   display the following acknowledgement: This product includes software
   developed by the EDINA.
4. Neither the name of the EDINA nor the names of its contributors may be used to
   endorse or promote products derived from this software without specific prior
   written permission.

THIS SOFTWARE IS PROVIDED BY EDINA ''AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
SHALL EDINA BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
DAMAGE.
*/

"use strict";

/* jshint multistr: true */

define([], function(){
    var questions = {
        "root": {
            "name": "Is it ",
            "children": [['Primarly vegetated', '1.0.0'], ['Primarly non-vegetated', '2.0.0']],
            "leadsTo": "Base Class I"
        },
        "Base Class I": {
            "name": "Is it mostly",
            "children": [["green", null], ["brown", null], ["burnt", null]],
            "leadsTo": ["1.0.0", "2.0.0"]
        },
        "1.0.0": {
            "name": "Is it ",
            "children": [["terrestrial", "1.1.0"], ["aquatic/regularly flooded", "1.2.0"]]
        },
        "1.1.0": {
            "name": "Is it ",
            "children": [["cultivated/managed (Primarily vegetated, terrestrial cultivated/managed)", "1.1.1"], ["natural/semi-natural (Primarily vegetated, terrestrial natural/semi-natural)", "1.1.2"]],
            "leadsTo": "PV"
        },
        "1.2.0": {
            "name": "Is it ",
            "children": [["Is it cultivated/managed (Primarily vegetated, aquatic/regularly flooded, cultivated/managed)", "1.2.1"], ["Is it natural/semi-natural (Primarily vegetated, aquatic/regularly flooded, natural/semi-natural)", "1.2.2"]],
            "leadsTo": "PV"
        },
        "PV": {
            "name": "Is it primarly ",
            "children": [["Trees", "PV.1"],["Bushes,shrubs", "PV.2.1"],["Herbaceous plants(grasses and forbs)", "PV.3.1"],["Succulents", "PV.1-1"],["Lichens", "PV.1-2"],["Mosses", "PV.1-3"]],
            "leadsTo": ["PV.2.1", "PV.3.1", "PV.1"]
        },
        "PV.2.1": {
            "name": "Is it ",
            "children": [["Regular bushes", "PV2.1"], ["Dward Shrubs", "PV2.2"]],
            "leadsTo": "PV.1"
        },
        "PV.3.1": {
            "name": "Is it ",
            "children": [["Regular graminaceous", "PV1.1"], ["Reeds", "PV1.2"], ["Forbs, ferns", "PV3.3"]],
            "leadsTo": "PV.1"
        },
        "PV.1": {
            "name": "Is it ",
            "children": [["Broadleaved", "PV.1.1"], ["Coniferous", "PV.1.2"], ["Palm Trees", "PV.1.3"]],
            "leadsTo": "PV.2"
        },
        "PV.2": {
            "name": "Name the leaf character",
            "children": [["Sclerophyte", "PV.2.1"], ["Regular", "PV.2.2"]],
            "leadsTo": "PV.3"
        },
        "PV.3": {
            "name": "Describe the phenology",
            "children": [["Annual", null], ["Multiannual", null], ["Permanent", null], ["Evergreen", null], ["Deciduous", null]],
            "leadsTo": "PV.4"
        },
        "PV.4": {
            "name": "What is the crown cover density (%)?",
            "children": "integer",
            "leadsTo": "PV.5"
        },
        "PV.5": {
            "name": "What is the vegetation height (m)?",
            "children": "integer",
            "leadsTo": "PV.6"
        },
        "PV.6": {
            "name": "Is there a second layer of vegetation?",
            "children": [["yes, but I don’t want to add more info on it", null], ["no", null], ["yes and I will provide more info on that now", "PV"]],
            "leadsTo": ["1.1.1_1.2.1_1", "end"]
        },
        "1.1.1_1.2.1_1": {
            "name": "What is the agricultural type?",
            "children": [["Arable cropland", "1.1.1_1.2.1_1.1"], ["Permanent cropland", "1.1.1_1.2.1_1.2"], ["Permanent grassland", "1.1.1_1.2.1_1.3"]],
            "leadsTo": "1.1.1_1.2.1_2"
        },
        "1.1.1_1.2.1_2": {
            "name": "What is the cultivation pattern?",
            "children": [["Crop rotation", "1.1.1_1.2.1_2.1"], ["No crop rotation", "1.1.1_1.2.1_2.2"], ["Plantation", "1.1.1_1.2.1_2.3"], ["Extensive orchards", "1.1.1_1.2.1_2.4"], ["Agroforestry", "1.1.1_1.2.1_2.5"], ["Shifting cultivation (slash and burn)", "1.1.1_1.2.1_2.6"]],
            "leadsTo": "1.1.1_1.2.1_3"
        },
        "1.1.1_1.2.1_3": {
            "name": "Is there fertilizing?",
            "children": [["Yes", "1.1.1_1.2.1_3.1"], ["No", "1.1.1_1.2.1_3.2"], ["Not sure", "1.1.1_1.2.1_3.3"]],
            "leadsTo": "1.1.1_1.2.1_4" 
        },
        "1.1.1_1.2.1_4": {
            "name": "Is there irrigation?",
            "children": [["Yes", "1.1.1_1.2.1_4.1"], ["No", "1.1.1_1.2.1_4.2"], ["Not sure", "1.1.1_1.2.1_4.3"]],
            "leadsTo": "1.1.1_1.2.1_5" 
        },
        "1.1.1_1.2.1_5": {
            "name": "Is there mowing?",
            "children": [["Yes", "1.1.1_1.2.1_5.1"], ["No", "1.1.1_1.2.1_5.2"], ["Not sure", "1.1.1_1.2.1_5.3"]],
            "leadsTo": ["1.1.1_1.2.1_5.1", "1.1.1_1.2.1_6"]
        },
        "1.1.1_1.2.1_5.1": {
            "name": "Is it intense?",
            "children": [["yes", null], ["no", null]],
            "leadsTo": "1.1.1_1.2.1_6"
        },
        "1.1.1_1.2.1_6": {
            "name": "Is there grazing?",
            "children": [["Yes", "1.1.1_1.2.1_6.1"], ["No", "1.1.1_1.2.1_6.2"], ["Not sure", "1.1.1_1.2.1_6.3"]],
            "leadsTo": ["1.1.1_1.2.1_6.1", "1.1.1_1.2.1_7"]
        },
        "1.1.1_1.2.1_6.1": {
            "name": "Is it intense?",
            "children": [["yes", null], ["no", null]],
            "leadsTo": "1.1.1_1.2.1_7"
        },
        "1.1.1_1.2.1_7": {
            "name": "Is there drainage?",
            "children": [["Yes", "1.1.1_1.2.1_7.1"], ["No", "1.1.1_1.2.1_7.2"], ["Not sure", "1.1.1_1.2.1_7.3"]],
            "leadsTo": "1.1.1_1.2.1_8"
        },
        "1.1.1_1.2.1_8": {
            "name": "Is there drainage?",
            "children": [["Yes", "1.1.1_1.2.1_8.1"], ["No", "1.1.1_1.2.1_8.2"], ["Not sure", "1.1.1_1.2.1_8.3"]],
            "leadsTo": "1.1.1_1.2.1_9"
        },
        "1.1.1_1.2.1_9": {
            "name": "Is the land managed as a forest?",
            "children": [["Yes", "1.1.1_1.2.1_9.1"], ["No", "1.1.1_1.2.1_9.2"], ["Not sure", "1.1.1_1.2.1_9.3"], ["Other", "1.1.1_1.2.1_9.4"]],
            "leadsTo": ["1.1.1_1.2.1_9.1", "1.1.1_1.2.1_11"]
        },
        "1.1.1_1.2.1_9.1": {
            "name": "Is it managed for wood production?",
            "children": [["Yes", "1.1.1_1.2.1_9.1.1"], ["No", "1.1.1_1.2.1_9.1.2"], ["Not sure", "1.1.1_1.2.1_9.1.3"]],
            "leadsTo": ["1.1.1_1.2.1_9.1.1", "1.1.1_1.2.1_9.1.2"]
        },
        "1.1.1_1.2.1_9.1.1": {
            "name": "Is it ",
            "children": [["Is it a plantation (i.e. plantation, monoculture, large clearcuts, strong soil preparation, short cycles)", "1.1.1_1.2.1_10.1.1.1"], ["Is it regular forestry with clearcuts possible?", "1.1.1_1.2.1_10.1.1.2"]],
            "leadsTo": "1.1.1_1.2.1_9.2"
        },
        "1.1.1_1.2.1_9.2": {
            "name": "Is it multifunctional?",
            "children": [["Yes", "1.1.1_1.2.1_9.2.1"], ["No", "1.1.1_1.2.1_9.2.2"], ["Not sure", "1.1.1_1.2.1_9.2.3"]],
            "leadsTo": "1.1.1_1.2.1_10"
        },
        "1.1.1_1.2.1_10": {
            "name": "Is the land managed as cropland? ",
            "children": [["Yes", "1.1.1_1.2.1_10.1"], ["No", "1.1.1_1.2.1_10.2"], ["Not sure", "1.1.1_1.2.1_10.3"]],
            "leadsTo": ["1.1.1_1.2.1_10.1", "1.1.1_1.2.1_11"]
        },
        "1.1.1_1.2.1_10.1": {
            "name": "Is it for ",
            "children": [["arable crops? (e.g. cereal, rice, root crops, leguminous, oil crops, vegetables, cotton, hop, asparagus, strawberries, flowers)", "1.1.1_1.2.1_10.1.1"], ["permanent crops? (e.g. vineyards, fruit/berries/nuts, olive trees, nursery/Christmas trees, coffee/tea/cacao, banana, willow)", "1.1.1_1.2.1_10.1.2"]],
            "leadsTo": "1.1.1_1.2.1_11"
        },
        "1.1.1_1.2.1_11": {
            "name": "Is it pasture/meadow?",
            "children": [["Yes", "1.1.1_1.2.1_12.1"], ["No", "1.1.1_1.2.1_12.2"], ["Not sure", "1.1.1_1.2.1_12.3"], ["Other", "1.1.1_1.2.1_12.4"]],
            "leadsTo": "1.1.1_1.2.1_12"
        },
        "1.1.1_1.2.1_12": {
            "name": "What is the approx. field size?",
            "children": "integer",
            "leadsTo": ["", "end"]
        },
        "1.2.1.1": {
            "name": "Water regime:",
            "children": [["Is it waterlogged?", "1.2.1.1.1"], ["Is it wet periodically/seasonally?", "1.2.1.1.2"], ["Is it episodic i.e. dry for several months?", "1.2.1.1.3"]],
            "leadsTo": "1.2.1.2"
        },
        "1.2.1.2": {
            "name": "Wetness:",
            "children": [["Is there surface water?", "1.2.1.2.1"], ["Is there saturated ground?", "1.2.1.2.2"]],
            "leadsTo": "1.2.1.2"
        },
        "1.2.1.3": {
            "name": "Salinity",
            "children": [["Is the water saline?", "1.2.1.3.1"], ["Is the water brackish?", "1.2.1.3.2"], ["Is the water fresh?", "1.2.1.3.3"]],
            "leadsTo": "1.2.1.4"
        },
        "1.2.1.4": {
            "name": "Is there a tidal influence?",
            "children": [["Yes", "1.2.1.4.1"], ["No", "1.2.1.3.2"], ["Not Sure", "1.2.1.4.1"]],
            "leadsTo": "end"
        },
        "2.0.0": {
            "name": "Is it ",
            "children": [["terrestrial", "2.1.0"], ["aquatic/regularly flooded", "2.2.0"]]
        },
        "2.1.0": {
            "name": "Is it ",
            "children": [["artificial surfaces and constructions (primarily non-vegetated, terrestrial, artificial surfaces and constructions)", "2.1.1"], ["bare areas/natural material surface (primarily non-vegetated, terrestrial, bare areas/natural material surfaces)", "2.1.2"]]
        },
        "2.2.0": {
            "name": "Is it ",
            "children": [["artificial waterbodies, snow, ice (primarily non-vegetated, aquatic/regularly flooded, artificial waterbodies, snow, ice)", "2.2.1"], ["natural waterbodies, snow, ice (primarily non-vegetated, aquatic/regularly flooded, natural waterbodies, snow, ice)", "2.2.2"]]
        },
        "2.1.1": {
            "name": "Is it ",
            "children": [["Sealed", "AS-C1"], ["Non-sealed", "AS-C2"]]
        },
        "AS-C1": {
            "name": "Is it ",
            "children": [["Buildings", "AS-C1.1"], ["Other constructions", "AS-C1.2"]]
        },
        "AS-C1.1": {
            "name": "Bildings:",
            "children": [["Are they, Conventional buildings (e.g. houses, blocks of flats, city street blocks, stores) ", "AS-C1.1.1"], ["Specific buildings (e.g. stadiums, churches, towers, greenhouse)", "AS-C2.1.2"]]
        },
        "AS-C2": {
            "name": "",
            "children": [["Is it Waste materials (e.g. communal / industrial/ waste)", "AS-C2.1"], ["Other artificial surface (e.g. nat. mat. displaced from original origin, artificially consolidated, e.g. logistic and storage areas, festive squares, unvegetated sport fields, railway tracks)", "AS-C2.2"]]
        },
        "2.1.2": {
            "name": "Is it ",
            "children": [["Consolidated?", "BNM1"], ["Un-consolidated", "BNM2"]]
        },
        "BNM1": {
            "name": "Is it ",
            "children": [["Bare rock?", "BNM1.1"], ["Hard-pan?", "BNM1.2"]]
        },
        "BNM2": {
            "name": "Is it ",
            "children": [["Mineral fragments?", "BNM2.1"], ["Bare soils", "BNM2.2"], ["Natural deposits", "BNM2.3"]]
        },
        "BNM2.1": {
            "name": "Is it ",
            "children": [["Boulders, stones?", "BNM2.1.1"], ["Pebbles, gravel?", "BNM2.1.2"], ["Sand, grit?", "BNM2.1.3"], ["Clay, silt?", "BNM2.1.4"], ["Mixed, unsorted material?", "BNM2.1.5"]]
        },
        "BNM2.3": {
            "name": "Is it ",
            "children": [["inorganic deposits?", "BNM2.3.1"], ["organic deposits?", "BNM2.3.2"]]
        },
        "2.2.1": {
            "name": "Is it ",
            "children": [["watersource?", "2.2.1.1"], ["waterbody?", "2.2.1.2"], ["lagoon?", "2.2.1.3"], ["other?", "2.2.1.4"]]
        },
        "2.2.2": {
            "name": "Is it ",
            "children": [["watersource?", "2.2.2.1"], ["waterbody?", "2.2.2.2"], ["estuary?", "2.2.2.3"], ["lagoon?", "2.2.2.3"], ["open sea?", "2.2.2.4"], ["permanent snow?", "2.2.2.5"], ["ice/glacier?", "2.2.2.6"]]
        }
    };
    
    var mapping = {
        "root": ["Base Class I"]
    };

    return {
        "questions": questions
    };

});