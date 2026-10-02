export interface ROCrateEntity {
  '@id': string;
  '@type': string | string[];
  name?: string;
  description?: string;
  datePublished?: string;
  author?: {
    '@id': string;
    name: string;
    affiliation?: string;
  };
  license?: string;
  conformsTo?: {
    '@id': string;
  };
  hasPart?: Array<{ '@id': string }>;
  [key: string]: unknown;
}

export interface ROCrateMetadata {
  '@context': string;
  '@graph': ROCrateEntity[];
}

export function generateROCrate(
  traceId: string,
  eventsCount: number,
  authorName = 'Alexander Katin'
): ROCrateMetadata {
  return {
    '@context': 'https://w3id.org/ro/crate/1.1/context',
    '@graph': [
      {
        '@id': 'ro-crate-metadata.json',
        '@type': 'CreativeWork',
        conformsTo: {
          '@id': 'https://w3id.org/ro/crate/1.1',
        },
        about: {
          '@id': './',
        },
      },
      {
        '@id': './',
        '@type': 'Dataset',
        name: `Episteme Multi-Agent Execution Provenance: ${traceId}`,
        description:
          'FAIR-compliant research provenance crate recording multi-agent crystallization protocol synthesis, epistemic referee gates (FWER, negative control foils), Opentrons OT-2 Python protocol, and human steering interventions.',
        datePublished: new Date().toISOString(),
        license: 'https://creativecommons.org/licenses/by/4.0/',
        author: {
          '@id': 'https://github.com/lessthanzero',
          name: authorName,
          affiliation: 'Computational Science & Epistemic Systems Lab',
        },
        hasPart: [
          { '@id': 'protocol_opentrons_ot2.py' },
          { '@id': 'decision_dag_trace.json' },
          { '@id': 'epistemic_ledger.duckdb' },
        ],
      },
      {
        '@id': 'protocol_opentrons_ot2.py',
        '@type': ['File', 'SoftwareSourceCode'],
        name: 'Opentrons OT-2 Protein Crystallization Screening Protocol',
        programmingLanguage: 'Python 3',
        description:
          'Validated 24-well hanging-drop vapor diffusion matrix with interleaving blinded solvent foils.',
      },
      {
        '@id': 'decision_dag_trace.json',
        '@type': ['File', 'Dataset'],
        name: 'Agent Decision DAG Event Ledger',
        description: `Complete serialised trace of ${eventsCount} multi-agent reasoning steps, tool calls, and human interventions.`,
      },
      {
        '@id': 'epistemic_ledger.duckdb',
        '@type': ['File', 'Dataset'],
        name: 'DuckDB Epistemic Verification Ledger',
        description:
          'Statistical hypothesis testing record with Bonferroni-corrected FWER thresholds and negative control null distributions.',
      },
    ],
  };
}
