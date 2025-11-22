/**
 * Default diagram content
 * This is loaded when no saved data exists in localStorage
 */

export const defaultContent = `<!-- Activities Column -->
                <div class="column activities" data-column-id="col-1">
                    <div class="column-header" contenteditable="false">Activities</div>
                    <div class="column-controls">
                        <button class="btn btn-remove" onclick="window.removeColumn(this)">Remove Column</button>
                    </div>

                    <div class="stream-container">
                        <div class="box" draggable="false">
                            <div class="box-controls">
                                <button class="box-btn box-btn-up" onclick="window.moveBoxUp(this)">↑</button>
                                <button class="box-btn box-btn-down" onclick="window.moveBoxDown(this)">↓</button>
                                <button class="box-btn box-btn-edit" onclick="window.editBox(this)">✏️</button>
                                <button class="box-btn box-btn-delete" onclick="window.deleteBox(this)">×</button>
                            </div>
                            <div class="box-title">Example Activity 1</div>
                            <div class="box-content">
                                Describe your activity here
                                <div class="resource">Resources needed</div>
                            </div>
                        </div>

                        <div class="box" draggable="false">
                            <div class="box-controls">
                                <button class="box-btn box-btn-up" onclick="window.moveBoxUp(this)">↑</button>
                                <button class="box-btn box-btn-down" onclick="window.moveBoxDown(this)">↓</button>
                                <button class="box-btn box-btn-edit" onclick="window.editBox(this)">✏️</button>
                                <button class="box-btn box-btn-delete" onclick="window.deleteBox(this)">×</button>
                            </div>
                            <div class="box-title">Example Activity 2</div>
                            <div class="box-content">
                                Describe your activity here
                            </div>
                        </div>

                        <div class="add-box-zone" onclick="window.addNewBox(this)">+ Add Box</div>
                    </div>
                </div>

                <!-- Outputs Column -->
                <div class="column outputs" data-column-id="col-2">
                    <div class="column-header" contenteditable="false">Outputs</div>
                    <div class="column-controls">
                        <button class="btn btn-remove" onclick="window.removeColumn(this)">Remove Column</button>
                    </div>

                    <div class="stream-container">
                        <div class="box" draggable="false">
                            <div class="box-controls">
                                <button class="box-btn box-btn-up" onclick="window.moveBoxUp(this)">↑</button>
                                <button class="box-btn box-btn-down" onclick="window.moveBoxDown(this)">↓</button>
                                <button class="box-btn box-btn-edit" onclick="window.editBox(this)">✏️</button>
                                <button class="box-btn box-btn-delete" onclick="window.deleteBox(this)">×</button>
                            </div>
                            <div class="box-title">Example Output 1</div>
                            <div class="box-content">
                                Direct results of your activities
                            </div>
                        </div>

                        <div class="box" draggable="false">
                            <div class="box-controls">
                                <button class="box-btn box-btn-up" onclick="window.moveBoxUp(this)">↑</button>
                                <button class="box-btn box-btn-down" onclick="window.moveBoxDown(this)">↓</button>
                                <button class="box-btn box-btn-edit" onclick="window.editBox(this)">✏️</button>
                                <button class="box-btn box-btn-delete" onclick="window.deleteBox(this)">×</button>
                            </div>
                            <div class="box-title">Example Output 2</div>
                            <div class="box-content">
                                Direct results of your activities
                            </div>
                        </div>

                        <div class="add-box-zone" onclick="window.addNewBox(this)">+ Add Box</div>
                    </div>
                </div>

                <!-- Outcomes Column -->
                <div class="column near-outcomes" data-column-id="col-3">
                    <div class="column-header" contenteditable="false">Outcomes</div>
                    <div class="column-controls">
                        <button class="btn btn-remove" onclick="window.removeColumn(this)">Remove Column</button>
                    </div>

                    <div class="stream-container">
                        <div class="box" draggable="false">
                            <div class="box-controls">
                                <button class="box-btn box-btn-up" onclick="window.moveBoxUp(this)">↑</button>
                                <button class="box-btn box-btn-down" onclick="window.moveBoxDown(this)">↓</button>
                                <button class="box-btn box-btn-edit" onclick="window.editBox(this)">✏️</button>
                                <button class="box-btn box-btn-delete" onclick="window.deleteBox(this)">×</button>
                            </div>
                            <div class="box-title">Example Outcome 1</div>
                            <div class="box-content">
                                <span class="actor">Actor: Target audience</span><br>
                                Changes that result from outputs
                                <div class="blocker">Blocker: Potential challenges</div>
                            </div>
                        </div>

                        <div class="box" draggable="false">
                            <div class="box-controls">
                                <button class="box-btn box-btn-up" onclick="window.moveBoxUp(this)">↑</button>
                                <button class="box-btn box-btn-down" onclick="window.moveBoxDown(this)">↓</button>
                                <button class="box-btn box-btn-edit" onclick="window.editBox(this)">✏️</button>
                                <button class="box-btn box-btn-delete" onclick="window.deleteBox(this)">×</button>
                            </div>
                            <div class="box-title">Example Outcome 2</div>
                            <div class="box-content">
                                Changes that result from outputs
                                <div class="assumption">Assumption: Key precondition</div>
                            </div>
                        </div>

                        <div class="add-box-zone" onclick="window.addNewBox(this)">+ Add Box</div>
                    </div>
                </div>

                <!-- Impact Column -->
                <div class="column impact" data-column-id="col-4">
                    <div class="column-header" contenteditable="false">Impact</div>
                    <div class="column-controls">
                        <button class="btn btn-remove" onclick="window.removeColumn(this)">Remove Column</button>
                    </div>

                    <div class="stream-container">
                        <div class="box" draggable="false">
                            <div class="box-controls">
                                <button class="box-btn box-btn-up" onclick="window.moveBoxUp(this)">↑</button>
                                <button class="box-btn box-btn-down" onclick="window.moveBoxDown(this)">↓</button>
                                <button class="box-btn box-btn-edit" onclick="window.editBox(this)">✏️</button>
                                <button class="box-btn box-btn-delete" onclick="window.deleteBox(this)">×</button>
                            </div>
                            <div class="box-title">Your Ultimate Impact</div>
                            <div class="box-content">
                                The long-term change you want to achieve
                            </div>
                        </div>

                        <div class="add-box-zone" onclick="window.addNewBox(this)">+ Add Box</div>
                    </div>
                </div>`;
