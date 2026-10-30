// lib/openapi.mjs - OpenAPI 3.1.0 Specification for PayPath Guardian API (APIMatic Ready)

export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "PayPath Guardian — Agentic Commerce & Procurement API",
    version: "2.4.0",
    description: "An enterprise API rail connecting autonomous AI agents to policy-governed PayPal Sandbox checkout, real-time AG Grid decision matrices, and immutable audit receipts.",
    contact: {
      name: "PayPath Team",
      url: "https://github.com/ManoShruthiS/paypath"
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT"
    }
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server"
    },
    {
      url: "https://paypath-git-main-mahi-77d1.vercel.app",
      description: "Production Vercel deployment"
    }
  ],
  paths: {
    "/api/config": {
      get: {
        summary: "Retrieve client configuration",
        description: "Returns public PayPal Client ID, AI model status, and runtime capabilities.",
        operationId: "getConfig",
        responses: {
          "200": {
            description: "Configuration details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    paypalClientId: { type: "string" },
                    aiEnabled: { type: "boolean" },
                    hasServerSecret: { type: "boolean" },
                    version: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/plan": {
      post: {
        summary: "Generate an autonomous procurement plan",
        description: "Transforms natural language buyer/business intent into an itemized, policy-audited commerce matrix.",
        operationId: "createProcurementPlan",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["intent"],
                properties: {
                  intent: {
                    type: "string",
                    description: "High-level goal or procurement requirement",
                    example: "Equip a remote engineering contractor with standard tooling under $150"
                  },
                  budgetLimit: {
                    type: "number",
                    description: "Optional maximum spending limit in USD",
                    example: 150.00
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Structured procurement matrix with policy audit",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProcurementPlan"
                }
              }
            }
          },
          "400": {
            description: "Invalid intent description"
          }
        }
      }
    },
    "/api/orders/create": {
      post: {
        summary: "Create a PayPal Sandbox order",
        description: "Creates an itemized order on PayPal Developer platform via Orders v2 API.",
        operationId: "createOrder",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["totalAmount"],
                properties: {
                  totalAmount: { type: "number", example: 124.99 },
                  currency: { type: "string", example: "USD" },
                  description: { type: "string", example: "PayPath Procured Hardware & Cloud Tooling" },
                  items: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/OrderItem"
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "PayPal order created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    orderId: { type: "string" },
                    status: { type: "string" },
                    mode: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/orders/capture": {
      post: {
        summary: "Capture and verify a PayPal Sandbox order",
        description: "Captures an authorized PayPal payment and issues a cryptographically sealed audit receipt.",
        operationId: "captureOrder",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId"],
                properties: {
                  orderId: { type: "string", example: "5O190127TN364715T" },
                  planDetails: { type: "object" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Payment captured and audit receipt generated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuditReceipt"
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      OrderItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          category: { type: "string" },
          vendor: { type: "string" },
          unitPrice: { type: "number" },
          quantity: { type: "integer" },
          total: { type: "number" },
          matchScore: { type: "integer" },
          compliance: { type: "string" },
          rationale: { type: "string" },
          selected: { type: "boolean" }
        }
      },
      ProcurementPlan: {
        type: "object",
        properties: {
          summary: { type: "string" },
          budgetLimit: { type: "number" },
          subtotal: { type: "number" },
          bundleSavings: { type: "number" },
          totalCalculated: { type: "number" },
          currency: { type: "string" },
          policyAudit: {
            type: "object",
            properties: {
              status: { type: "string" },
              policyRiskScore: { type: "integer" },
              rating: { type: "string" },
              checks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    rule: { type: "string" },
                    passed: { type: "boolean" },
                    detail: { type: "string" }
                  }
                }
              }
            }
          },
          items: {
            type: "array",
            items: {
              $ref: "#/components/schemas/OrderItem"
            }
          },
          agentTrace: {
            type: "array",
            items: {
              type: "object",
              properties: {
                step: { type: "string" },
                detail: { type: "string" }
              }
            }
          },
          impactStatement: { type: "string" },
          mode: { type: "string" }
        }
      },
      AuditReceipt: {
        type: "object",
        properties: {
          receiptId: { type: "string" },
          orderId: { type: "string" },
          captureId: { type: "string" },
          status: { type: "string" },
          financials: {
            type: "object",
            properties: {
              amount: { type: "string" },
              currency: { type: "string" },
              paymentRail: { type: "string" }
            }
          },
          cryptographicSeal: { type: "string" },
          timestamp: { type: "string" }
        }
      }
    }
  }
};
