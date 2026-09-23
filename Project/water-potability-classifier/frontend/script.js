
// ============================================
// WATERIQ FINAL FRONTEND
// ============================================

const API_URL = "http://127.0.0.1:8000";

let comparisonChart = null;
let cvChart = null;
let classChart = null;


// ============================================
// NAVIGATION
// ============================================

function showSection(sectionId, button) {

    document
        .querySelectorAll(".page-section")
        .forEach(section => {
            section.classList.remove(
                "active-section"
            );
        });

    document
        .querySelectorAll(".nav-item")
        .forEach(item => {
            item.classList.remove("active");
        });

    const section =
        document.getElementById(sectionId);

    if (section) {
        section.classList.add(
            "active-section"
        );
    }

    if (button) {
        button.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ============================================
// EXAMPLE VALUES
// ============================================

function loadExample() {

    const values = {

        ph: 7.2,

        Hardness: 200,

        Solids: 21000,

        Chloramines: 7.0,

        Sulfate: 330,

        Conductivity: 425,

        Organic_carbon: 14,

        Trihalomethanes: 66,

        Turbidity: 4.0
    };

    Object.entries(values)
        .forEach(([key, value]) => {

            const input =
                document.getElementById(key);

            if (input) {
                input.value = value;
            }
        });
}


// ============================================
// PREDICTION FORM
// ============================================

const predictionForm =
    document.getElementById(
        "predictionForm"
    );

if (predictionForm) {

    predictionForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const button =
                this.querySelector(
                    ".primary-btn"
                );

            button.disabled = true;
            button.textContent =
                "Analyzing...";

            try {

                const data = {

                    ph: Number(
                        document
                            .getElementById("ph")
                            .value
                    ),

                    Hardness: Number(
                        document
                            .getElementById("Hardness")
                            .value
                    ),

                    Solids: Number(
                        document
                            .getElementById("Solids")
                            .value
                    ),

                    Chloramines: Number(
                        document
                            .getElementById("Chloramines")
                            .value
                    ),

                    Sulfate: Number(
                        document
                            .getElementById("Sulfate")
                            .value
                    ),

                    Conductivity: Number(
                        document
                            .getElementById("Conductivity")
                            .value
                    ),

                    Organic_carbon: Number(
                        document
                            .getElementById(
                                "Organic_carbon"
                            )
                            .value
                    ),

                    Trihalomethanes: Number(
                        document
                            .getElementById(
                                "Trihalomethanes"
                            )
                            .value
                    ),

                    Turbidity: Number(
                        document
                            .getElementById("Turbidity")
                            .value
                    )
                };


                const response =
                    await fetch(
                        `${API_URL}/predict`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.detail ||
                        "Prediction failed."
                    );
                }


                displayPrediction(
                    result
                );


            } catch (error) {

                alert(
                    "Prediction request failed.\n\n" +
                    error.message
                );

            } finally {

                button.disabled = false;

                button.textContent =
                    "Analyze Water";
            }
        }
    );
}


// ============================================
// DISPLAY PREDICTION
// ============================================

function displayPrediction(result) {

    const placeholder =
        document.getElementById(
            "predictionPlaceholder"
        );

    const results =
        document.getElementById(
            "predictionResults"
        );

    if (placeholder) {
        placeholder.style.display =
            "none";
    }

    if (results) {
        results.classList.remove(
            "results-hidden"
        );
    }


    const rf =
        result.random_forest;

    const svm =
        result.svm;


    setText(
        "rfClassification",
        rf.classification
    );

    setText(
        "rfProbability",
        `${rf.potable_percentage.toFixed(2)}%`
    );

    setWidth(
        "rfProgress",
        rf.potable_percentage
    );

    setText(
        "rfIcon",
        rf.prediction === 1
            ? "✓"
            : "×"
    );


    setText(
        "svmClassification",
        svm.classification
    );

    setText(
        "svmProbability",
        `${svm.potable_percentage.toFixed(2)}%`
    );

    setWidth(
        "svmProgress",
        svm.potable_percentage
    );

    setText(
        "svmIcon",
        svm.prediction === 1
            ? "✓"
            : "×"
    );


    const badge =
        document.getElementById(
            "agreementBadge"
        );

    const agreement =
        document.getElementById(
            "agreementMessage"
        );


    if (result.model_agreement) {

        if (badge) {
            badge.textContent = "AGREE";
        }

        if (agreement) {
            agreement.textContent =
                "Both final models produced the same classification.";
        }

    } else {

        if (badge) {
            badge.textContent = "DISAGREE";
        }

        if (agreement) {
            agreement.textContent =
                "The final models produced different classifications. Review both outputs.";
        }
    }


    setText(
        "modelVersion",
        result.model_version || "FINAL"
    );
}


// ============================================
// HELPERS
// ============================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


function setWidth(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.style.width =
            `${value}%`;
    }
}


// ============================================
// LOAD ANALYTICS
// ============================================

async function loadAnalytics() {

    try {

        const response =
            await fetch(
                "results/analytics.json"
            );

        if (!response.ok) {
            throw new Error(
                "Analytics file could not be loaded."
            );
        }

        const data =
            await response.json();

        renderAnalytics(data);

    } catch (error) {

        console.error(
            "Analytics loading error:",
            error
        );
    }
}


// ============================================
// RENDER ANALYTICS
// ============================================

function renderAnalytics(data) {

    const rf =
        data.final_test.random_forest;

    const svm =
        data.final_test.svm;

    const dataset =
        data.dataset;


    // ----------------------------------------
    // Main metrics
    // ----------------------------------------

    setText(
        "rfAccuracy",
        formatPercent(rf.Accuracy)
    );

    setText(
        "svmAccuracy",
        formatPercent(svm.Accuracy)
    );

    setText(
        "rfAuc",
        formatPercent(rf["ROC-AUC"])
    );

    setText(
        "svmAuc",
        formatPercent(svm["ROC-AUC"])
    );


    // ----------------------------------------
    // Detailed metrics
    // ----------------------------------------

    setText(
        "rfPrecision",
        formatPercent(rf.Precision)
    );

    setText(
        "rfRecall",
        formatPercent(rf.Recall)
    );

    setText(
        "rfF1",
        formatPercent(rf["F1-Score"])
    );

    setText(
        "svmPrecision",
        formatPercent(svm.Precision)
    );

    setText(
        "svmRecall",
        formatPercent(svm.Recall)
    );

    setText(
        "svmF1",
        formatPercent(svm["F1-Score"])
    );


    // ----------------------------------------
    // Model cards
    // ----------------------------------------

    setText(
        "rfModelAccuracy",
        formatPercent(rf.Accuracy)
    );

    setText(
        "rfModelAuc",
        formatPercent(rf["ROC-AUC"])
    );

    setText(
        "rfModelF1",
        formatPercent(rf["F1-Score"])
    );

    setText(
        "svmModelAccuracy",
        formatPercent(svm.Accuracy)
    );

    setText(
        "svmModelAuc",
        formatPercent(svm["ROC-AUC"])
    );

    setText(
        "svmModelF1",
        formatPercent(svm["F1-Score"])
    );


    // ----------------------------------------
    // Dataset
    // ----------------------------------------

    setText(
        "datasetTotal",
        dataset.total_samples.toLocaleString()
    );

    setText(
        "datasetFeatures",
        dataset.feature_count
    );

    setText(
        "datasetTrain",
        dataset.training_samples.toLocaleString()
    );

    setText(
        "datasetTest",
        dataset.testing_samples.toLocaleString()
    );

    setText(
        "datasetNotPotable",
        dataset.not_potable.toLocaleString()
    );

    setText(
        "datasetPotable",
        dataset.potable.toLocaleString()
    );

    setText(
        "datasetNotPotablePercent",
        `${dataset.not_potable_percentage}%`
    );

    setText(
        "datasetPotablePercent",
        `${dataset.potable_percentage}%`
    );


    // ----------------------------------------
    // Hyperparameters
    // ----------------------------------------

    const rfParams =
        data.hyperparameters.random_forest;

    const svmParams =
        data.hyperparameters.svm;

    setText(
        "rfParams",
        JSON.stringify(
            rfParams,
            null,
            2
        )
    );

    setText(
        "svmParams",
        JSON.stringify(
            svmParams,
            null,
            2
        )
    );


    // ----------------------------------------
    // Tables
    // ----------------------------------------

    renderFinalMetricsTable(
        data
    );

    renderCVTable(
        data
    );

    renderFeatureImportance(
        data
    );


    // ----------------------------------------
    // Charts
    // ----------------------------------------

    renderComparisonChart(
        data
    );

    renderCVChart(
        data
    );

    renderClassChart(
        data
    );
}


// ============================================
// FINAL METRICS TABLE
// ============================================

function renderFinalMetricsTable(data) {

    const container =
        document.getElementById(
            "finalMetricsTable"
        );

    if (!container) {
        return;
    }

    const rf =
        data.final_test.random_forest;

    const svm =
        data.final_test.svm;

    container.innerHTML = `

        <div class="table-wrapper">

            <table class="analytics-table">

                <thead>

                    <tr>
                        <th>Metric</th>
                        <th>Random Forest</th>
                        <th>SVM</th>
                    </tr>

                </thead>

                <tbody>

                    <tr>
                        <td>Accuracy</td>
                        <td>${formatPercent(rf.Accuracy)}</td>
                        <td>${formatPercent(svm.Accuracy)}</td>
                    </tr>

                    <tr>
                        <td>Precision</td>
                        <td>${formatPercent(rf.Precision)}</td>
                        <td>${formatPercent(svm.Precision)}</td>
                    </tr>

                    <tr>
                        <td>Recall</td>
                        <td>${formatPercent(rf.Recall)}</td>
                        <td>${formatPercent(svm.Recall)}</td>
                    </tr>

                    <tr>
                        <td>F1-Score</td>
                        <td>${formatPercent(rf["F1-Score"])}</td>
                        <td>${formatPercent(svm["F1-Score"])}</td>
                    </tr>

                    <tr>
                        <td>ROC-AUC</td>
                        <td>${formatPercent(rf["ROC-AUC"])}</td>
                        <td>${formatPercent(svm["ROC-AUC"])}</td>
                    </tr>

                </tbody>

            </table>

        </div>
    `;
}


// ============================================
// CV TABLE
// ============================================

function renderCVTable(data) {

    const container =
        document.getElementById(
            "finalCVTable"
        );

    if (!container) {
        return;
    }

    const rf =
        data.cross_validation.random_forest;

    const svm =
        data.cross_validation.svm;

    const rows = [
        ["Accuracy", rf.accuracy, svm.accuracy],
        ["Precision", rf.precision, svm.precision],
        ["Recall", rf.recall, svm.recall],
        ["F1-Score", rf.f1, svm.f1],
        ["ROC-AUC", rf.roc_auc, svm.roc_auc]
    ];

    container.innerHTML = `

        <div class="table-wrapper">

            <table class="analytics-table">

                <thead>

                    <tr>
                        <th>Metric</th>
                        <th>Random Forest</th>
                        <th>SVM</th>
                    </tr>

                </thead>

                <tbody>

                    ${rows.map(row => `

                        <tr>

                            <td>
                                ${row[0]}
                            </td>

                            <td>
                                ${formatPercent(row[1].mean)}
                                ±
                                ${formatPercent(row[1].std)}
                            </td>

                            <td>
                                ${formatPercent(row[2].mean)}
                                ±
                                ${formatPercent(row[2].std)}
                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>
    `;
}


// ============================================
// FEATURE IMPORTANCE
// ============================================

function renderFeatureImportance(data) {

    const container =
        document.getElementById(
            "featureImportanceList"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        data.feature_importance
            .map(item => `

                <div class="importance-row">

                    <div class="importance-name">
                        ${item.feature}
                    </div>

                    <div class="importance-track">

                        <div
                            class="importance-fill"
                            style="
                                width:
                                ${item.importance * 100}%;
                            "
                        ></div>

                    </div>

                    <div class="importance-value">
                        ${item.importance.toFixed(3)}
                    </div>

                </div>

            `)
            .join("");
}


// ============================================
// MODEL COMPARISON CHART
// ============================================

function renderComparisonChart(data) {

    const canvas =
        document.getElementById(
            "comparisonChart"
        );

    if (!canvas) {
        return;
    }

    if (comparisonChart) {
        comparisonChart.destroy();
    }

    const rf =
        data.final_test.random_forest;

    const svm =
        data.final_test.svm;

    comparisonChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: [
                        "Accuracy",
                        "Precision",
                        "Recall",
                        "F1-Score",
                        "ROC-AUC"
                    ],

                    datasets: [

                        {
                            label:
                                "Random Forest",

                            data: [
                                rf.Accuracy,
                                rf.Precision,
                                rf.Recall,
                                rf["F1-Score"],
                                rf["ROC-AUC"]
                            ]
                        },

                        {
                            label:
                                "SVM",

                            data: [
                                svm.Accuracy,
                                svm.Precision,
                                svm.Recall,
                                svm["F1-Score"],
                                svm["ROC-AUC"]
                            ]
                        }
                    ]
                },

                options: {

                    responsive: true,

                    scales: {

                        y: {
                            min: 0,
                            max: 1,

                            ticks: {
                                callback:
                                    value =>
                                        `${value * 100}%`
                            }
                        }
                    },

                    plugins: {

                        legend: {
                            position: "bottom"
                        }
                    }
                }
            }
        );
}


// ============================================
// CV CHART
// ============================================

function renderCVChart(data) {

    const canvas =
        document.getElementById(
            "cvChart"
        );

    if (!canvas) {
        return;
    }

    if (cvChart) {
        cvChart.destroy();
    }

    const rf =
        data.cross_validation.random_forest;

    const svm =
        data.cross_validation.svm;

    cvChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: [
                        "Accuracy",
                        "Precision",
                        "Recall",
                        "F1-Score",
                        "ROC-AUC"
                    ],

                    datasets: [

                        {
                            label:
                                "Random Forest - 5 Fold Mean",

                            data: [
                                rf.accuracy.mean,
                                rf.precision.mean,
                                rf.recall.mean,
                                rf.f1.mean,
                                rf.roc_auc.mean
                            ]
                        },

                        {
                            label:
                                "SVM - 5 Fold Mean",

                            data: [
                                svm.accuracy.mean,
                                svm.precision.mean,
                                svm.recall.mean,
                                svm.f1.mean,
                                svm.roc_auc.mean
                            ]
                        }
                    ]
                },

                options: {

                    responsive: true,

                    scales: {

                        y: {
                            min: 0,
                            max: 1,

                            ticks: {
                                callback:
                                    value =>
                                        `${value * 100}%`
                            }
                        }
                    },

                    plugins: {

                        legend: {
                            position: "bottom"
                        }
                    }
                }
            }
        );
}


// ============================================
// CLASS DISTRIBUTION CHART
// ============================================

function renderClassChart(data) {

    const canvas =
        document.getElementById(
            "classChart"
        );

    if (!canvas) {
        return;
    }

    if (classChart) {
        classChart.destroy();
    }

    const dataset =
        data.dataset;

    classChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: [
                        "Not Potable",
                        "Potable"
                    ],

                    datasets: [
                        {
                            data: [
                                dataset.not_potable,
                                dataset.potable
                            ]
                        }
                    ]
                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {
                            position: "bottom"
                        }
                    }
                }
            }
        );
}


// ============================================
// FORMAT PERCENTAGE
// ============================================

function formatPercent(value) {

    return `${(
        Number(value) * 100
    ).toFixed(2)}%`;
}


// ============================================
// INITIALIZE
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadAnalytics();

    }
);
