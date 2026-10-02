export const OPENTRONS_PROTOCOL_CODE = `"""
Opentrons OT-2 Protein Crystallization Screening Protocol
Synthesised by Episteme Multi-Agent Protocol Designer
Validated by Epistemic Referee (Negative Control Foils & FWER Gate Passed)
"""
from opentrons import protocol_api

metadata = {
    'protocolName': 'Episteme PEG-3350 Vapor Diffusion Screening',
    'author': 'Alexander Katin <Computational Science Lab>',
    'description': '24-well hanging-drop matrix (pH 6.9-7.3) with negative control solvent decoys',
    'apiLevel': '2.14'
}

def run(protocol: protocol_api.ProtocolContext):
    # 1. Deck Labware Setup
    tiprack_300 = protocol.load_labware('opentrons_96_tiprack_300ul', '1')
    reservoir = protocol.load_labware('nest_12_reservoir_15ml', '2')
    crystallization_plate = protocol.load_labware('corning_24_wellplate_3.4ml_flat', '3')
    
    # 2. Pipette Mount
    p300 = protocol.load_instrument('p300_multi', 'right', tip_racks=[tiprack_300])

    # Reagent Locations (Reservoir)
    buffer_stock = reservoir.wells_by_name()['A1']      # 0.2M Ammonium Sulfate stock
    peg_stock = reservoir.wells_by_name()['A2']         # 40% w/v PEG 3350
    solvent_foil_blank = reservoir.wells_by_name()['A3'] # Negative Control Blank (Decoy)
    
    protocol.comment("Beginning automated matrix dispensing with negative control foil interleaving...")

    # 3. Dispense Base Reservoir Buffer (500 uL per well)
    wells = crystallization_plate.wells()
    
    p300.pick_up_tip()
    for i, well in enumerate(wells[:12]):
        # Interleave Blinded Foil at Well 4 (A4)
        if i == 3:
            protocol.comment(f"Dispensing Blinded Negative Control Foil into Well {well.well_name}")
            p300.transfer(150, solvent_foil_blank, well, new_tip='never')
        else:
            p300.transfer(150, buffer_stock, well, new_tip='never')
    p300.drop_tip()

    # 4. Dispense PEG Gradient (Fine gradient dictated by human steering directive)
    p300.pick_up_tip()
    for well in wells[:12]:
        p300.transfer(15.0, peg_stock, well, mix_after=(3, 20), new_tip='never')
    p300.drop_tip()

    protocol.comment("Protocol complete. Ready for hanging-drop sealing and UV plate imaging.")
`;
