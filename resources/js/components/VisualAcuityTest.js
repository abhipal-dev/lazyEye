import React from 'react';
import $ from 'jquery';

/**
 * VisualAcuityTest
 * Clinical Tumbling 'E' optotype examination.
 * Measures visual acuity (Snellen equivalent) from 20/100 down to 20/20.
 * Designed with clean clinical aesthetics - easy to explain and justify.
 */
export default class VisualAcuityTest extends React.Component {
    constructor(props) {
        super(props);

        // Standard clinical Snellen levels and corresponding optotype sizes in pixels
        this.levels = [
            { snellen: '20/100', size: 72, label: 'Low Acuity Baseline' },
            { snellen: '20/70',  size: 52, label: 'Moderate Acuity' },
            { snellen: '20/50',  size: 38, label: 'Functional Acuity' },
            { snellen: '20/40',  size: 28, label: 'Mild Amblyopia Threshold' },
            { snellen: '20/30',  size: 22, label: 'Near Normal Vision' },
            { snellen: '20/25',  size: 17, label: 'Standard Normal' },
            { snellen: '20/20',  size: 13, label: 'Optimal Visual Acuity' }
        ];

        this.directions = ['up', 'right', 'down', 'left'];

        this.state = {
            testStarted: false,
            testCompleted: false,
            currentLevelIndex: 0,
            trialNumber: 1,         // 4 trials per level
            correctInLevel: 0,
            currentDirection: 'right',
            finalAcuity: 'Not Tested',
            history: []
        };
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (e) => {
        if (!this.state.testStarted || this.state.testCompleted) return;

        if (e.key === 'ArrowUp')    { e.preventDefault(); this.submitAnswer('up'); }
        if (e.key === 'ArrowRight') { e.preventDefault(); this.submitAnswer('right'); }
        if (e.key === 'ArrowDown')  { e.preventDefault(); this.submitAnswer('down'); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); this.submitAnswer('left'); }
    };

    startTest = () => {
        const randomDir = this.directions[Math.floor(Math.random() * this.directions.length)];
        this.setState({
            testStarted: true,
            testCompleted: false,
            currentLevelIndex: 0,
            trialNumber: 1,
            correctInLevel: 0,
            currentDirection: randomDir,
            finalAcuity: 'Not Tested',
            history: []
        });
    };

    submitAnswer = (chosenDir) => {
        const { currentDirection, currentLevelIndex, trialNumber, correctInLevel, history } = this.state;
        const currentLevel = this.levels[currentLevelIndex];
        const isCorrect = chosenDir === currentDirection;

        const newCorrectInLevel = isCorrect ? correctInLevel + 1 : correctInLevel;
        const nextTrial = trialNumber + 1;

        const newHistory = [
            ...history,
            {
                level: currentLevel.snellen,
                direction: currentDirection,
                answered: chosenDir,
                correct: isCorrect
            }
        ];

        // 4 trials per level
        if (nextTrial > 4) {
            // Patient needs at least 3 out of 4 correct to pass the level
            if (newCorrectInLevel >= 3) {
                // If passed the hardest level (20/20), test is complete
                if (currentLevelIndex + 1 >= this.levels.length) {
                    this.finishTest(currentLevel.snellen, newHistory);
                } else {
                    // Advance to next harder level
                    const nextDir = this.directions[Math.floor(Math.random() * this.directions.length)];
                    this.setState({
                        currentLevelIndex: currentLevelIndex + 1,
                        trialNumber: 1,
                        correctInLevel: 0,
                        currentDirection: nextDir,
                        history: newHistory
                    });
                }
            } else {
                // Failed current level -> Acuity is previous passed level (or < 20/100)
                const finalSnellen = currentLevelIndex > 0 ? this.levels[currentLevelIndex - 1].snellen : '< 20/100';
                this.finishTest(finalSnellen, newHistory);
            }
        } else {
            // Continue next trial in same level
            const nextDir = this.directions[Math.floor(Math.random() * this.directions.length)];
            this.setState({
                trialNumber: nextTrial,
                correctInLevel: newCorrectInLevel,
                currentDirection: nextDir,
                history: newHistory
            });
        }
    };

    finishTest = (resultAcuity, finalHistory) => {
        this.setState({
            testCompleted: true,
            finalAcuity: resultAcuity,
            history: finalHistory
        });

        // Save result to patient record in database
        try {
            const token = $('meta[name="csrf-token"]').attr('content');
            const patientId = this.props.patient?.id || document.querySelector("section#user")?.dataset?.id;
            if (patientId) {
                const scoreMap = {
                    '20/20': 100,
                    '20/25': 90,
                    '20/30': 80,
                    '20/40': 70,
                    '20/50': 60,
                    '20/70': 50,
                    '20/100': 40
                };
                const numericScore = scoreMap[resultAcuity] || 30;
                $.ajax({
                    url: "/SaveGameRecords",
                    type: "post",
                    headers: { 'X-CSRF-TOKEN': token },
                    data: {
                        id: patientId,
                        game_name: 'Visual Acuity (' + resultAcuity + ')',
                        game_score: numericScore,
                        duration: 180
                    },
                    success: function() {
                        window.dispatchEvent(new CustomEvent('lazyeye:game-completed'));
                    }
                });
            }
        } catch (err) {
            console.warn("Could not save acuity test result:", err);
        }
    };

    getRotationDeg = (dir) => {
        switch (dir) {
            case 'up':    return 270;
            case 'right': return 0;
            case 'down':  return 90;
            case 'left':  return 180;
            default:      return 0;
        }
    };

    render() {
        const { testStarted, testCompleted, currentLevelIndex, trialNumber, currentDirection, finalAcuity } = this.state;
        const currentLevel = this.levels[currentLevelIndex] || this.levels[0];

        return (
            <div className="py-4">
                {/* Clinical Header */}
                <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                    <div>
                        <h3 className="fw-bold mb-1 text-main">
                            <i className="fa-solid fa-eye text-primary me-2"></i>Visual Acuity Examination
                        </h3>
                        <p className="text-muted small mb-0">
                            Clinical Tumbling 'E' Optotype Test &middot; Standard Snellen Calibration
                        </p>
                    </div>
                    {testStarted && !testCompleted && (
                        <div className="badge bg-primary px-3 py-2 fs-6">
                            Target Level: {currentLevel.snellen} &middot; Trial {trialNumber}/4
                        </div>
                    )}
                </div>

                {/* State 1: Instructions & Start Screen */}
                {!testStarted && !testCompleted && (
                    <div className="card border shadow-sm p-4 text-center max-w-600 mx-auto" style={{ maxWidth: 620, backgroundColor: 'var(--bg-card)' }}>
                        <div className="mb-3 text-primary">
                            <i className="fa-solid fa-circle-question fa-3x"></i>
                        </div>
                        <h4 className="fw-bold mb-2">Instructions for Patient</h4>
                        <div className="text-start small text-secondary mb-4 mx-auto" style={{ maxWidth: 500, lineHeight: 1.7 }}>
                            <p className="mb-2">1. Sit at a comfortable distance from your monitor (approx. <strong>50–60 cm</strong>).</p>
                            <p className="mb-2">2. Wear corrective glasses if normally prescribed for reading or computer use.</p>
                            <p className="mb-2">3. An 'E' symbol will appear on the screen facing <strong>Up, Down, Left, or Right</strong>.</p>
                            <p className="mb-0">4. Indicate the direction using your <strong>Keyboard Arrow Keys</strong> or the on-screen buttons.</p>
                        </div>
                        <button className="btn btn-primary px-4 py-2 fw-bold rounded-pill mx-auto" onClick={this.startTest}>
                            <i className="fa-solid fa-play me-2"></i>Begin Vision Test
                        </button>
                    </div>
                )}

                {/* State 2: Active Optotype Examination */}
                {testStarted && !testCompleted && (
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            <div className="card border shadow-sm text-center p-4 mb-3" style={{ backgroundColor: 'var(--bg-card)' }}>
                                <div className="text-muted small mb-3">Which direction is the letter 'E' pointing?</div>

                                {/* Optotype Display Well */}
                                <div 
                                    className="d-flex align-items-center justify-content-center mx-auto mb-4 bg-white border rounded" 
                                    style={{ width: 220, height: 220 }}
                                >
                                    <span 
                                        style={{
                                            fontFamily: '"Courier New", Courier, monospace',
                                            fontWeight: '900',
                                            fontSize: `${currentLevel.size}px`,
                                            lineHeight: 1,
                                            color: '#000000',
                                            display: 'inline-block',
                                            transform: `rotate(${this.getRotationDeg(currentDirection)}deg)`,
                                            transition: 'transform 0.05s ease'
                                        }}
                                    >
                                        E
                                    </span>
                                </div>

                                {/* On-Screen Direction Buttons */}
                                <div className="d-flex flex-column align-items-center gap-2 mb-3">
                                    <button 
                                        className="btn btn-outline-secondary px-4 py-2 fw-bold" 
                                        onClick={() => this.submitAnswer('up')}
                                        style={{ width: 120 }}
                                    >
                                        <i className="fa-solid fa-arrow-up me-1"></i> UP
                                    </button>
                                    <div className="d-flex gap-2">
                                        <button 
                                            className="btn btn-outline-secondary px-4 py-2 fw-bold" 
                                            onClick={() => this.submitAnswer('left')}
                                            style={{ width: 120 }}
                                        >
                                            <i className="fa-solid fa-arrow-left me-1"></i> LEFT
                                        </button>
                                        <button 
                                            className="btn btn-outline-secondary px-4 py-2 fw-bold" 
                                            onClick={() => this.submitAnswer('right')}
                                            style={{ width: 120 }}
                                        >
                                            RIGHT <i className="fa-solid fa-arrow-right ms-1"></i>
                                        </button>
                                    </div>
                                    <button 
                                        className="btn btn-outline-secondary px-4 py-2 fw-bold" 
                                        onClick={() => this.submitAnswer('down')}
                                        style={{ width: 120 }}
                                    >
                                        <i className="fa-solid fa-arrow-down me-1"></i> DOWN
                                    </button>
                                </div>

                                <div className="small text-muted">
                                    Tip: You can also press the <strong>Arrow Keys</strong> on your keyboard.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* State 3: Test Complete & Result Card */}
                {testCompleted && (
                    <div className="card border shadow-sm p-4 text-center mx-auto" style={{ maxWidth: 580, backgroundColor: 'var(--bg-card)' }}>
                        <div className="mb-2 text-success">
                            <i className="fa-solid fa-circle-check fa-3x"></i>
                        </div>
                        <h4 className="fw-bold mb-1">Visual Acuity Assessment Complete</h4>
                        <p className="text-muted small mb-4">Patient visual acuity recorded under standard computer display conditions.</p>

                        <div className="bg-light p-3 rounded border mb-4">
                            <span className="small text-uppercase fw-bold text-muted d-block">Measured Snellen Acuity</span>
                            <span className="display-5 fw-bold text-primary">{finalAcuity}</span>
                            <span className="d-block small text-muted mt-1">
                                {finalAcuity === '20/20' || finalAcuity === '20/25' ? 'Normal / Optimal Acuity' : 'Recommended for Binocular Fusion Therapy'}
                            </span>
                        </div>

                        <div className="d-flex justify-content-center gap-3">
                            <button className="btn btn-primary px-4 py-2 fw-bold rounded-pill" onClick={this.startTest}>
                                <i className="fa-solid fa-rotate-right me-2"></i>Retake Examination
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

