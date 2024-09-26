import os
import uuid
from flask import Flask, request, jsonify, send_from_directory
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'generated_bills'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def calculate_bill(weight_collected, required_weight, payment_per_ton, fine_rate):
    basic_pay = weight_collected * payment_per_ton
    deficit = max(0, required_weight - weight_collected)
    fine = deficit * fine_rate
    total_bill = basic_pay - fine

    return {
        "weight_collected": weight_collected,
        "required_weight": required_weight,
        "basic_pay": basic_pay,
        "deficit": deficit,
        "fine": fine,
        "total_bill": total_bill
    }

def scale_image(img_path, max_width, max_height):
    img = Image(img_path)
    width, height = img.drawWidth, img.drawHeight

    ratio = min(max_width / width, max_height / height)
    img.drawWidth = width * ratio
    img.drawHeight = height * ratio

    return img

def generate_realistic_bill_pdf(bill_data, contractor_name, pdf_filename="realistic_bill.pdf"):
    doc = SimpleDocTemplate(pdf_filename, pagesize=letter)
    elements = []

    styles = getSampleStyleSheet()
    title_style = styles['Title']
    normal_style = styles['Normal']
    bold_style = styles['Heading2']

    logo_path = "logo.png"
    try:
        logo = scale_image(logo_path, 2 * inch, inch)
        elements.append(logo)
    except Exception as e:
        print(f"Error loading logo: {e}")
    elements.append(Paragraph("EcoSync Waste Management", title_style))
    elements.append(Paragraph("123 Main Street, Dhaka, Bangladesh", normal_style))
    elements.append(Paragraph("Phone: +880 123 456 789 | Email: support@ecosync.com", normal_style))
    elements.append(Spacer(1, 20))

    elements.append(Paragraph(f"Bill for Contractor: {contractor_name}", bold_style))
    elements.append(Spacer(1, 20))

    table_data = [
        ["Description", "Value"],
        ["Weight Collected", f"{bill_data['weight_collected']} tons"],
        ["Required Weight", f"{bill_data['required_weight']} tons"],
        ["Basic Pay", f"{bill_data['basic_pay']} Taka"],
        ["Deficit", f"{bill_data['deficit']} tons"],
        ["Fine", f"{bill_data['fine']} Taka"],
        ["Total Bill", f"{bill_data['total_bill']} Taka"]
    ]

    table = Table(table_data, colWidths=[2.5 * inch, 2.5 * inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    elements.append(table)
    elements.append(Spacer(1, 40))
    elements.append(Paragraph("Authorized Signature: ___________________", normal_style))
    elements.append(Spacer(1, 20))
    elements.append(Paragraph("Generated using EcoSync Waste Management System", normal_style))
    doc.build(elements)

@app.route('/generate_bill', methods=['POST'])
def generate_bill():
    try:
        data = request.json
        contractor_name = data.get('contractor_name', 'Contractor')
        weight_collected = float(data['weight_collected'])
        required_weight = float(data['required_weight'])
        payment_per_ton = float(data['payment_per_ton'])
        fine_rate = float(data['fine_rate'])

        bill_data = calculate_bill(weight_collected, required_weight, payment_per_ton, fine_rate)
        unique_id = uuid.uuid4()
        pdf_filename = f"{unique_id}.pdf"
        pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], pdf_filename)
        generate_realistic_bill_pdf(bill_data, contractor_name, pdf_path)
        download_url = f"{request.url_root}download/{pdf_filename}"
        return jsonify({"status": "success", "download_url": download_url}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(port=6000)
