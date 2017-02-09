
package gov.va.med.jmeadows_2_3_0.webservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for prescriptionFill complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="prescriptionFill">
 *   &lt;complexContent>
 *     &lt;extension base="{http://webservice.vds.DNS       /}dataBean">
 *       &lt;sequence>
 *         &lt;element name="dispenseDate" type="{http://www.w3.org/2001/XMLSchema}dateTime" minOccurs="0"/>
 *         &lt;element name="dispensingPharmacy" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="dispensingQuantity" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "prescriptionFill", namespace = "http://webservice.vds.DNS       /", propOrder = {
    "dispenseDate",
    "dispensingPharmacy",
    "dispensingQuantity"
})
public class PrescriptionFill
    extends DataBean
{

    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar dispenseDate;
    protected String dispensingPharmacy;
    protected String dispensingQuantity;

    /**
     * Gets the value of the dispenseDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getDispenseDate() {
        return dispenseDate;
    }

    /**
     * Sets the value of the dispenseDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setDispenseDate(XMLGregorianCalendar value) {
        this.dispenseDate = value;
    }

    /**
     * Gets the value of the dispensingPharmacy property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDispensingPharmacy() {
        return dispensingPharmacy;
    }

    /**
     * Sets the value of the dispensingPharmacy property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDispensingPharmacy(String value) {
        this.dispensingPharmacy = value;
    }

    /**
     * Gets the value of the dispensingQuantity property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDispensingQuantity() {
        return dispensingQuantity;
    }

    /**
     * Sets the value of the dispensingQuantity property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDispensingQuantity(String value) {
        this.dispensingQuantity = value;
    }

}
