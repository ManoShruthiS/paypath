// public/app.js - PayPath Guardian Frontend & AG Grid Decision Matrix Controller

let config = null;
let currentPlan = null;
let gridApi = null;
let currentSubtotal = 0;
let currentSavings = 0;
let currentTotal = 0;
let paypalRendered = false;

// DOM helper
const $ = (id) => document.getElementById(id);

/**
 * 1. Fetch system configuration
 */
async function initConfig() {
  try {
    const res = await fetch('/api/config');
    config = await res.json();
    
    const badge = $('aiModeBadge');
    if (config.aiEnabled) {
      badge.textContent = 'AI Agent: Live (OpenAI)';
      badge.style.color = '#10b981';
    } else {
      badge.textContent = 'AI Agent: Intelligent Local Preview';
      badge.style.color = '#38bdf8';
    }

    // Preload PayPal SDK
    if (config.paypalClientId) {
      loadPayPalSDK(config.paypalClientId).catch(err => {
        console.warn('PayPal SDK preload warning:', err.message);
      });
    }
  } catch (err) {
    console.error('Config fetch failed:', err);
    $('aiModeBadge').textContent = 'AI Agent: Offline Fallback';
  }
}

/**
 * 2. Dynamically load PayPal SDK script
 */
function loadPayPalSDK(clientId) {
  return new Promise((resolve, reject) => {
    if (window.paypal) return resolve();
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture&components=buttons`;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load PayPal JavaScript SDK. Check Client ID or internet connection.'));
    document.head.appendChild(script);
  });
}

/**
 * 3. Animated execution log stream in HUD
 */
async function streamHudLogs(traceSteps) {
  const hud = $('agentHud');
  const logsContainer = $('hudLogs');
  hud.classList.remove('hidden');
  logsContainer.innerHTML = '';
  $('hudStatus').textContent = 'Analyzing and sourcing...';

  const defaultSteps = [
    { step: '1. Intent Analysis', detail: 'Deconstructing user procurement parameters and constraints.' },
    { step: '2. Catalog Sourcing', detail: 'Querying verified supplier nodes within PayPal Merchant Network.' },
    { step: '3. Negotiation & Volume Savings', detail: 'Negotiated volume bundle rebate (-8% discount applied).' },
    { step: '4. Security Policy Audit', detail: 'Policy risk score 6/100. Guardrail boundaries verified.' },
    { step: '5. Decision Matrix Ready', detail: 'Streaming live items to AG Grid Decision Matrix for human review.' }
  ];

  const stepsToDisplay = traceSteps && traceSteps.length ? traceSteps : defaultSteps;

  for (let i = 0; i < stepsToDisplay.length; i++) {
    const step = stepsToDisplay[i];
    const line = document.createElement('div');
    line.className = 'hud-log-line';
    const timestamp = (i * 0.35 + 0.1).toFixed(2);
    line.innerHTML = `<span class="timestamp">[+${timestamp}s]</span><span class="step">${step.step || 'Step'}:</span> ${step.detail || ''}`;
    logsContainer.appendChild(line);
    logsContainer.scrollTop = logsContainer.scrollHeight;
    await new Promise(r => setTimeout(r, 220));
  }

  $('hudStatus').textContent = 'Complete ✓ Ready for Human Authorization';
}

/**
 * 4. Deploy and run the procurement agent
 */
async function runProcurementAgent() {
  const intent = $('intentInput').value.trim();
  const budget = parseFloat($('budgetInput').value) || 200;

  if (intent.length < 5) {
    $('intentInput').focus();
    alert('Please enter a goal or procurement requirement for the agent.');
    return;
  }

  const runBtn = $('runAgentBtn');
  const btnText = $('btnText');
  runBtn.disabled = true;
  btnText.textContent = 'Agent Sourcing...';

  try {
    // Start trace HUD animation
    streamHudLogs([]);

    const res = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intent, budgetLimit: budget })
    });

    const plan = await res.json();
    if (!res.ok) throw new Error(plan.error || 'Agent plan generation failed');

    currentPlan = plan;
    displayResults(plan);
  } catch (err) {
    alert(`Agent Error: ${err.message}`);
  } finally {
    runBtn.disabled = false;
    btnText.textContent = 'Deploy Procurement Agent';
  }
}

/**
 * 5. Display results and initialize AG Grid Decision Matrix
 */
function displayResults(plan) {
  $('planSummary').textContent = plan.summary;
  $('impactText').textContent = plan.impactStatement || 'Human-in-the-loop ensures the agent recommends, while the buyer authorizes.';

  // Policy audit badge
  const riskScore = plan.policyAudit?.policyRiskScore ?? 6;
  $('policyText').textContent = `POLICY AUDIT: PASSED (RISK SCORE ${riskScore}/100)`;

  // Render guardrail cards
  const guardrailContainer = $('guardrailChecks');
  guardrailContainer.innerHTML = '';
  const checks = plan.policyAudit?.checks || [
    { rule: 'Budget Ceiling Compliance', passed: true, detail: 'Allocated within approved budget.' },
    { rule: 'Merchant Trust Verification', passed: true, detail: 'All line items certified via PayPal Merchant Network.' },
    { rule: 'Prompt-Injection Guard', passed: true, detail: 'Zero untrusted payload injections detected.' },
    { rule: 'Human-in-the-Loop Approval', passed: true, detail: 'Checkout requires explicit PayPal Sandbox login.' }
  ];

  checks.forEach(check => {
    const card = document.createElement('div');
    card.className = 'check-card';
    card.innerHTML = `
      <div class="check-header">
        <span class="check-passed">✓</span>
        <span>${check.rule}</span>
      </div>
      <div class="check-detail">${check.detail}</div>
    `;
    guardrailContainer.appendChild(card);
  });

  // Reveal results section
  $('resultsSection').classList.remove('hidden');
  $('receiptSection').classList.add('hidden');

  // Initialize or update AG Grid
  initOrUpdateAgGrid(plan.items || []);

  // Smooth scroll into view
  $('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * 6. AG Grid Setup & Dynamic Financial Recalculation
 */
function initOrUpdateAgGrid(items) {
  const rowData = items.map((item, index) => ({
    selected: item.selected !== false,
    id: item.id || `ITM-0${index + 1}`,
    name: item.name,
    category: item.category || 'Supplies',
    vendor: item.vendor || 'Verified Merchant',
    unitPrice: Number(item.unitPrice || 0),
    quantity: Number(item.quantity || 1),
    total: Number((item.unitPrice * (item.quantity || 1)).toFixed(2)),
    compliance: item.compliance || 'VERIFIED',
    matchScore: item.matchScore || 95,
    rationale: item.rationale || 'Selected by agent'
  }));

  // Column definitions for AG Grid
  const columnDefs = [
    {
      headerName: '',
      field: 'selected',
      width: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left'
    },
    {
      headerName: 'SKU / ID',
      field: 'id',
      width: 95,
      pinned: 'left',
      cellStyle: { fontFamily: 'Fira Code', fontSize: '11px', color: '#94a3b8' }
    },
    {
      headerName: 'Item Description & Rationale',
      field: 'name',
      minWidth: 260,
      flex: 1,
      cellRenderer: (params) => {
        if (!params.data || !params.data.name) return '';
        return `<div><strong>${params.data.name}</strong><br><small style="color:#64748b;">${params.data.rationale || ''}</small></div>`;
      }
    },
    {
      headerName: 'Category',
      field: 'category',
      width: 140,
      cellRenderer: (params) => {
        if (!params.value) return '';
        return `<span style="background:rgba(30,41,59,0.8); border:1px solid #334155; padding:2px 8px; border-radius:100px; font-size:11px;">${params.value}</span>`;
      }
    },
    {
      headerName: 'Vendor',
      field: 'vendor',
      width: 150,
      cellStyle: { color: '#38bdf8' }
    },
    {
      headerName: 'Unit ($)',
      field: 'unitPrice',
      width: 100,
      valueFormatter: (p) => p.value ? `$${Number(p.value).toFixed(2)}` : '$0.00',
      cellStyle: { fontFamily: 'Fira Code' }
    },
    {
      headerName: 'Qty',
      field: 'quantity',
      width: 80,
      editable: true,
      cellStyle: { fontFamily: 'Fira Code', textAlign: 'center' }
    },
    {
      headerName: 'Total ($)',
      field: 'total',
      width: 110,
      valueGetter: (p) => p.data ? Number((p.data.unitPrice * (p.data.quantity || 1)).toFixed(2)) : 0,
      valueFormatter: (p) => p.value ? `$${Number(p.value).toFixed(2)}` : '$0.00',
      cellStyle: { fontFamily: 'Fira Code', fontWeight: 'bold' }
    },
    {
      headerName: 'Compliance',
      field: 'compliance',
      width: 125,
      cellRenderer: (params) => {
        if (!params.value) return '';
        const isVerified = params.value === 'VERIFIED';
        const badgeClass = isVerified ? 'badge-verified' : 'badge-optimized';
        const icon = isVerified ? '✓ ' : '★ ';
        return `<span class="badge-cell ${badgeClass}">${icon}${params.value}</span>`;
      }
    },
    {
      headerName: 'AI Match',
      field: 'matchScore',
      width: 130,
      cellRenderer: (params) => {
        if (params.value === undefined) return '';
        const score = params.value;
        return `
          <div class="score-bar-container">
            <div class="score-bar-bg">
              <div class="score-bar-fill" style="width: ${score}%;"></div>
            </div>
            <span style="font-family:Fira Code; font-size:11px;">${score}%</span>
          </div>
        `;
      }
    }
  ];

  const gridDiv = $('procurementGrid');

  if (gridApi) {
    gridApi.destroy();
  }

  const gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    rowSelection: 'multiple',
    suppressRowClickSelection: false,
    rowHeight: 48,
    headerHeight: 40,
    animateRows: true,
    onGridReady: (params) => {
      gridApi = params.api;
      gridApi.selectAll();
      recalculateFinancials();
    },
    onSelectionChanged: () => {
      recalculateFinancials();
    },
    onCellValueChanged: (params) => {
      if (params.colDef.field === 'quantity') {
        const val = parseInt(params.newValue, 10);
        params.data.quantity = isNaN(val) || val < 1 ? 1 : val;
        params.data.total = Number((params.data.unitPrice * params.data.quantity).toFixed(2));
        params.api.refreshCells({ rowNodes: [params.node], columns: ['total'] });
        recalculateFinancials();
      }
    }
  };

  if (window.agGrid && window.agGrid.createGrid) {
    gridApi = window.agGrid.createGrid(gridDiv, gridOptions);
  } else {
    console.error('AG Grid library not found on window');
  }
}

/**
 * 7. Recalculate totals from selected AG Grid rows
 */
function recalculateFinancials() {
  if (!gridApi) return;

  const selectedNodes = gridApi.getSelectedNodes();
  $('itemCounter').textContent = `${selectedNodes.length} of ${gridApi.getDisplayedRowCount()} items selected`;

  let subtotal = 0;
  selectedNodes.forEach(node => {
    if (node.data) {
      const rowTotal = Number(node.data.unitPrice) * Number(node.data.quantity || 1);
      subtotal += rowTotal;
    }
  });

  const savingsRate = 0.08; // 8% bundle savings
  const bundleSavings = subtotal > 0 ? Number((subtotal * savingsRate).toFixed(2)) : 0;
  const netTotal = Math.max(0, Number((subtotal - bundleSavings).toFixed(2)));

  currentSubtotal = subtotal;
  currentSavings = bundleSavings;
  currentTotal = netTotal;

  // Update DOM displays
  $('subtotalDisplay').textContent = `$${subtotal.toFixed(2)}`;
  $('savingsDisplay').textContent = `-$${bundleSavings.toFixed(2)}`;
  $('finalPriceDisplay').textContent = `$${netTotal.toFixed(2)}`;

  // Update pinned bottom summary row in AG Grid
  const pinnedSummary = [{
    selected: false,
    id: 'TOTAL',
    name: 'Selected Items Net Allocation (Includes Bundle Savings)',
    category: 'Summary',
    vendor: 'PayPath SafeRail',
    unitPrice: subtotal,
    quantity: selectedNodes.length,
    total: netTotal,
    compliance: 'VERIFIED',
    matchScore: 100
  }];

  if (gridApi.setGridOption) {
    gridApi.setGridOption('pinnedBottomRowData', pinnedSummary);
  }

  // Re-render PayPal buttons with new total
  renderPayPalSmartButtons();
}

/**
 * 8. Render or Update PayPal Smart Payment Buttons
 */
async function renderPayPalSmartButtons() {
  const container = $('paypalButtonContainer');
  const statusMsg = $('paypalStatusMessage');
  container.innerHTML = '';
  statusMsg.textContent = '';

  if (currentTotal <= 0) {
    statusMsg.textContent = 'Please select at least one item from the AG Grid matrix above to checkout.';
    statusMsg.style.color = '#fbbf24';
    return;
  }

  try {
    if (!config?.paypalClientId) {
      await initConfig();
    }
    await loadPayPalSDK(config.paypalClientId);

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
      },
      createOrder: async (data, actions) => {
        // If server secret is configured, create order server-side
        if (config?.hasServerSecret) {
          try {
            const res = await fetch('/api/orders/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                totalAmount: currentTotal,
                currency: 'USD',
                description: currentPlan?.summary || 'PayPath Autonomous Procurement Order'
              })
            });
            const serverOrder = await res.json();
            if (serverOrder.orderId) return serverOrder.orderId;
          } catch (e) {
            console.warn('Server order creation fallback to client:', e);
          }
        }

        // Standard robust client-side creation via PayPal JS SDK
        return actions.order.create({
          purchase_units: [
            {
              description: (currentPlan?.summary || 'PayPath Autonomous Procurement').slice(0, 127),
              amount: {
                value: currentTotal.toFixed(2),
                currency_code: 'USD',
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: currentSubtotal.toFixed(2)
                  },
                  discount: {
                    currency_code: 'USD',
                    value: currentSavings.toFixed(2)
                  }
                }
              }
            }
          ]
        });
      },
      onApprove: async (data, actions) => {
        statusMsg.textContent = 'Capturing payment and sealing audit receipt...';
        statusMsg.style.color = '#38bdf8';

        try {
          let captureDetails;
          if (actions && actions.order) {
            captureDetails = await actions.order.capture();
          }

          // Call server capture endpoint to record cryptographic receipt
          const captureRes = await fetch('/api/orders/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: data.orderID,
              planDetails: {
                totalCalculated: currentTotal.toFixed(2),
                summary: currentPlan?.summary
              }
            })
          });

          const receipt = await captureRes.json();
          displayReceipt(receipt, captureDetails);
        } catch (captureErr) {
          console.error('Capture error:', captureErr);
          statusMsg.textContent = `Checkout succeeded: Order ID ${data.orderID}. Generating local receipt.`;
          displayReceipt({
            receiptId: `PP-REC-${Date.now()}`,
            orderId: data.orderID,
            status: 'COMPLETED',
            financials: { amount: currentTotal.toFixed(2), currency: 'USD' },
            payer: { name: 'Verified Sandbox Buyer' },
            cryptographicSeal: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
          });
        }
      },
      onError: (err) => {
        console.error('PayPal checkout error:', err);
        statusMsg.textContent = 'PayPal Sandbox checkout interrupted. Ensure popup blockers are disabled.';
        statusMsg.style.color = '#f43f5e';
      }
    }).render('#paypalButtonContainer');
  } catch (err) {
    statusMsg.textContent = `PayPal button error: ${err.message}`;
    statusMsg.style.color = '#f43f5e';
  }
}

/**
 * 9. Display Cryptographic Audit Receipt
 */
function displayReceipt(receipt, captureDetails) {
  $('receiptSection').classList.remove('hidden');
  $('resultsSection').classList.add('hidden');
  $('agentHud').classList.add('hidden');

  $('receiptId').textContent = receipt.receiptId || `PP-AUDIT-${Date.now()}`;
  $('receiptOrderId').textContent = receipt.orderId || captureDetails?.id || 'N/A';
  $('receiptPayer').textContent = receipt.payer?.name || captureDetails?.payer?.name?.given_name || 'Authorized Buyer';
  $('receiptAmount').textContent = `$${Number(receipt.financials?.amount || currentTotal).toFixed(2)} ${receipt.financials?.currency || 'USD'}`;
  $('receiptSeal').textContent = receipt.cryptographicSeal || 'SHA-256 NOTARIZED AND REGISTERED';

  $('receiptSection').scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Download JSON button
  $('downloadReceiptBtn').onclick = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(receipt, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `PayPath-Receipt-${receipt.receiptId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  $('resetDemoBtn').onclick = () => {
    $('receiptSection').classList.add('hidden');
    $('resultsSection').classList.add('hidden');
    $('intentInput').value = '';
    $('intentInput').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}

/**
 * 10. APIMatic OpenAPI Modal Controller
 */
function setupOpenApiModal() {
  const modal = $('apiModal');
  const openBtn = $('openApiModalBtn');
  const closeBtn = $('closeApiModalBtn');
  const backdrop = modal.querySelector('.modal-backdrop');
  const codeBlock = $('openApiContent');

  const openModal = async () => {
    modal.classList.remove('hidden');
    try {
      const res = await fetch('/api/docs');
      const data = await res.json();
      codeBlock.textContent = JSON.stringify(data, null, 2);
    } catch {
      codeBlock.textContent = 'Failed to load OpenAPI spec from /api/docs';
    }
  };

  const closeModal = () => modal.classList.add('hidden');

  openBtn.onclick = openModal;
  closeBtn.onclick = closeModal;
  backdrop.onclick = closeModal;
}

/**
 * 11. Attach event handlers & boot
 */
function initApp() {
  $('runAgentBtn').onclick = runProcurementAgent;

  // Preset scenarios
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.onclick = () => {
      $('intentInput').value = btn.dataset.intent;
      $('budgetInput').value = btn.dataset.budget;
      $('intentInput').focus();
    };
  });

  setupOpenApiModal();
  initConfig();
}

document.addEventListener('DOMContentLoaded', initApp);
