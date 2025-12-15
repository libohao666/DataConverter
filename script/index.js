document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    
    // Dynamically generate all cards
    cardData.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <div class="card-title">${card.title}</div>
            <div class="card-content">
                <a href="${card.link}">${card.description}</a>
            </div>
            <div class="card-specs">
                ${card.specs.map(spec => `
                    <div class="spec-item">${spec.label}: ${spec.value}</div>
                `).join('')}
            </div>
            <div align="center" style="background-color: lightgrey;">
                <div align="center" id="${card.converterId}" style="display: inline;">
                    <div style="font-size: 120%; font-weight: bold; padding: 0.5em;">
                        ${card.title}
                    </div>
                    <div id="convnumeric_${index}">
                        <table id="numbertable_${index}" style="border-collapse: collapse;">
                            <tbody>
                                <tr>
                                    <td style="text-align: left; padding: 0em 1em;"></td>
                                    ${card.converterType === 'float' ? `
                                    <td style="text-align: center; padding: 0.5em 1em; font-weight: bold; background-color: rgb(210, 210, 231);">Sign</td>
                                    <td style="text-align: center; padding: 0.5em 1em; font-weight: bold; background-color: rgb(192, 221, 194);">Exponent</td>
                                    <td style="text-align: center; padding: 0.5em 1em; font-weight: bold; background-color: rgb(221, 208, 196);">Mantissa</td>
                                    ` : card.converterType === 'ascend' ? `
                                    <td style="text-align: center; padding: 0.5em 1em; font-weight: bold; background-color: rgb(210, 210, 231);">Bits</td>
                                    ` : `
                                    <td style="text-align: center; padding: 0.5em 1em; font-weight: bold; background-color: rgb(210, 210, 231);">Bits</td>
                                    `}
                                </tr>
                                <tr>
                                    <td style="text-align: left; padding: 0em 1em; font-weight: bold;">Value:</td>
                                    ${card.converterType === 'float' ? `
                                    <td style="text-align: center; padding: 0em 1em; background-color: rgb(210, 210, 231);"><span id="sign_value_${index}">+1</span></td>
                                    <td style="text-align: center; padding: 0em 1em; background-color: rgb(192, 221, 194);"><span id="exponent_value_${index}"></span></td>
                                    <td style="text-align: center; padding: 0em 1em; background-color: rgb(221, 208, 196);"><span id="mantissa_value_${index}"></span></td>
                                    ` : card.converterType === 'ascend' ? `
                                    <td style="text-align: center; padding: 0em 1em; background-color: rgb(210, 210, 231);"><span id="ascend_value_${index}"></span></td>
                                    ` : `
                                    <td style="text-align: center; padding: 0em 1em; background-color: rgb(210, 210, 231);"><span id="int_value_${index}"></span></td>
                                    `}
                                </tr>
                                <tr>
                                    <td style="text-align: left; padding: 0em 1em; font-weight: bold;">Encoded as:</td>
                                    ${card.converterType === 'float' ? `
                                    <td style="text-align: center; padding: 0em 1em; background-color: rgb(210, 210, 231);"><span id="actual_sign_${index}">0</span></td>
                                    <td style="text-align: center; padding: 0em 1em; background-color: rgb(192, 221, 194);"><span id="actual_exponent_${index}">0000</span></td>
                                    <td style="text-align: center; padding: 0em 1em; background-color: rgb(221, 208, 196);"><span id="actual_mantissa_${index}">000</span></td>
                                    ` : card.converterType === 'ascend' ? `
                                    <td style="text-align: center; padding: 0em 1em; background-color: rgb(210, 210, 231);"><span id="actual_ascend_${index}">00000000</span></td>
                                    ` : `
                                    <td style="text-align: center; padding: 0em 1em; background-color: rgb(210, 210, 231);"><span id="actual_bits_${index}">00000000</span></td>
                                    `}
                                </tr>
                                <tr>
                                    <td style="text-align: left; padding: 0em 1em; font-weight: bold;">Calculation process:</td>
                                    <td colspan="${card.converterType === 'float' ? 3 : 1}" style="text-align: center; padding: 0em 1em; background-color: ${card.converterType === 'float' ? 'rgb(210, 210, 231)' : 'rgb(221, 208, 196)'};">
                                        <span id="calculation_process_${index}"></span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: left; padding: 0em 1em; font-weight: bold;">Binary:</td>
                                    ${card.converterType === 'float' ? `
                                    <td style="text-align: center; padding: 0em 1em; margin-right: 0.5em; background-color: rgb(210, 210, 231);">
                                        <form>
                                            <div style="display: flex; flex-wrap: wrap; align-items: center;">
                                                <div style="display: flex; flex-direction: column; align-items: center; margin-right: 0.5em;">
                                                    <input type="checkbox" class="floatdigit" id="cbsign_${index}">
                                                    <span style="margin-top: 5px;">${card.exponentBits + card.mantissaBits}</span>
                                                </div>
                                            </div>
                                        </form>
                                    </td>
                                    <td style="text-align: center; padding: 0em 1em; margin-right: 0.5em; background-color: rgb(192, 221, 194);">
                                        <form>
                                            <div style="display: flex; flex-wrap: wrap; align-items: center;">
                                                ${Array.from({length: card.exponentBits}, (_, i) => `
                                                <div style="display: flex; flex-direction: column; align-items: center; margin-right: 0.5em;">
                                                    <input type="checkbox" class="floatdigit" id="cbexp${i}_${index}">
                                                    <span style="margin-top: 5px;">${card.exponentBits + card.mantissaBits - i - 1}</span>
                                                </div>
                                                `).join('')}
                                            </div>
                                        </form>
                                    </td>
                                    <td style="text-align: center; padding: 0em 1em; margin-right: 0.5em; background-color: rgb(221, 208, 196);">
                                        <form>
                                            <div style="display: flex; flex-wrap: wrap; align-items: center;">
                                                ${Array.from({length: card.mantissaBits}, (_, i) => `
                                                    <div style="display: flex; flex-direction: column; align-items: center; margin-right: 0.5em;">
                                                        <input type="checkbox" class="floatdigit" id="cbmant${i}_${index}">
                                                        <span style="margin-top: 5px;">${card.mantissaBits - i - 1}</span>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </form>
                                    </td>
                                    ` : card.converterType === 'ascend' ? `
                                    <td style="text-align: center; padding: 0em 1em; margin-right: 0.5em; background-color: rgb(210, 210, 231);">
                                        <form>
                                            <div style="display: flex; flex-wrap: wrap; align-items: center;">
                                                ${Array.from({length: card.bits}, (_, i) => `
                                                    <div style="display: flex; flex-direction: column; align-items: center; margin-right: 0.5em;">
                                                        <input type="checkbox" class="ascenddigit" id="cbascend${i}_${index}">
                                                        <span style="margin-top: 5px;">${card.bits - i - 1}</span>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </form>
                                    </td>
                                    ` : `
                                    <td style="text-align: center; padding: 0em 1em; margin-right: 0.5em; background-color: rgb(210, 210, 231);">
                                        <form>
                                            <div style="display: flex; flex-wrap: wrap; align-items: center;">
                                                ${Array.from({length: card.bits}, (_, i) => `
                                                    <div style="display: flex; flex-direction: column; align-items: center; margin-right: 0.5em;">
                                                        <input type="checkbox" class="floatdigit" id="cbint${i}_${index}">
                                                        <span style="margin-top: 5px;">${card.bits - i - 1}</span>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </form>
                                    </td>
                                    `}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div id="convtext_${index}">
                        <table>
                            <tbody>
                                <tr>
                                    <td id="dec_repr_text_${index}">Decimal Representation</td>
                                    <td>
                                        <form id="decimalform_${index}">
                                            <input type="text" size="60" id="decimal_${index}">
                                        </form>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Value actually stored:</td>
                                    <td><input type="text" size="60" id="highprecision_decimal_${index}" readonly></td>
                                </tr>
                                <tr>
                                    <td>Binary Representation</td>
                                    <td><form><input type="text" size="60" id="binary_${index}"></form></td>
                                </tr>
                                <tr>
                                    <td>Hexadecimal Representation</td>
                                    <td><form><input type="text" size="60" id="hexadecimal_${index}"></form></td>
                                </tr>
                            </tbody>
                        </table>
                        <div id="convstatus_${index}" style="margin: 0.5em;"></div>
                    </div>
                    <script type="text/javascript">
                        window.document.getElementById("${card.converterId}").style.display = "inline";
                    </script>
                    <noscript>
                        (This page requires JavaScript)
                    </noscript>
                </div>
        `;
        
        container.appendChild(cardElement);
        
        // Initialize converter
        if (card.converterType === 'float') {
            new FloatConverter(
                card.signBits,
                card.exponentBits,
                card.mantissaBits,
                index,
                true
            );
        } else if (card.converterType === 'ascend') {
            new AscendConverter(index, true);
        } else {
            new IntConverter(
                card.bits,
                index,
                true
            );
        }
    });
    
    // Jump navigation
    const jumpSelect = document.getElementById('jump-select');
    
    // Dynamically populate jump menu options
    cardData.forEach((card, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = card.title;
        jumpSelect.appendChild(option);
    });
    
    // Handle jump menu change event
    jumpSelect.addEventListener('change', () => {
        const selectedIndex = parseInt(jumpSelect.value);
        if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < cardData.length) {
            const selectedCard = cardData[selectedIndex];
            const cardElement = document.querySelector(`.card:nth-child(${selectedIndex + 2})`);
            cardElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

